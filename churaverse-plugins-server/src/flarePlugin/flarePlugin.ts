import {
    IMainScene,
    BasePlugin,
    InitEvent,
    UpdateEvent,
    LivingDamageEvent,
    EntitySpawnEvent,
  } from 'churaverse-engine-server'
  import { FlarePluginStore } from './store/defFlarePluginStore'
  import { SocketController } from './controller/socketController'
  import { initFlarePluginStore } from './store/initFlarePluginStore'
  import { Flare } from './domain/flare'
  import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
  import { moveFlares, removeDieFlare } from './domain/flareService'
  import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
  import { Player } from '@churaverse/player-plugin-server/domain/player'
  import { FlareDamageCause } from './domain/flareDamageCause'
  import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
  import { FlareHitMessage } from './message/flareHitMessage'
  import { PlayerPluginStore } from '@churaverse/player-plugin-server/store/defPlayerPluginStore'
  
  export class FlarePlugin extends BasePlugin<IMainScene> {
    private flarePluginStore!: FlarePluginStore
    private mapPluginStore!: MapPluginStore
    private networkPluginStore!: NetworkPluginStore<IMainScene>
    private playerPluginStore!: PlayerPluginStore
  
    public listenEvent(): void {
      this.bus.subscribeEvent('init', this.init.bind(this))
      this.bus.subscribeEvent('update', this.update.bind(this))
  
      const socketController = new SocketController(this.bus, this.store)
      this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
      this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  
      this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
      this.bus.subscribeEvent('entitySpawn', this.spawnFlare.bind(this))
    }
  
    private init(ev: InitEvent): void {
      initFlarePluginStore(this.store)
      this.getStores()
    }
  
    private getStores(): void {
      this.flarePluginStore = this.store.of('flarePlugin')
      this.mapPluginStore = this.store.of('mapPlugin')
      this.networkPluginStore = this.store.of('networkPlugin')
      this.playerPluginStore = this.store.of('playerPlugin')
    }
  
    private update(ev: UpdateEvent): void {
      moveFlares(ev.dt, this.flarePluginStore.flares, this.mapPluginStore.mapManager.currentMap)
      removeDieFlare(this.flarePluginStore.flares, (flareId: string) => {
        const flareHitMessage = new FlareHitMessage({ flareId: flareId })
        this.networkPluginStore.messageSender.send(flareHitMessage)
      })
    }
  
    private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
      ev.collisionDetector.register(
        this.flarePluginStore.flares,
        this.playerPluginStore.players,
        this.flareHitPlayer.bind(this)
      )
    }
  
    private flareHitPlayer(flare: Flare, player: Player): void {
      // 炎を発射したプレイヤー自身との衝突は無視
      if (flare.ownerId === player.id) return
  
      if (player.isDead) return
  
      // プレイヤーと衝突した炎は消える
      flare.isDead = true
  
      // 炎衝突イベントの発火
      const flareDamageCause = new FlareDamageCause(flare)
      const livingDamageEvent = new LivingDamageEvent(player, flareDamageCause, flare.power)
      this.bus.post(livingDamageEvent)
    }
  
    private spawnFlare(ev: EntitySpawnEvent): void {
      if (!(ev.entity instanceof Flare)) return
      const flare = ev.entity
      this.flarePluginStore.flares.set(flare.flareId, flare)
      flare.walk(this.mapPluginStore.mapManager.currentMap)
    }
  }
  