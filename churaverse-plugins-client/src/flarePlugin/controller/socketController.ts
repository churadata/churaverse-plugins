import {
    IMainScene,
    IEventBus,
    Store,
    Position,
    EntitySpawnEvent,
    EntityDespawnEvent,
    LivingDamageEvent,
  } from 'churaverse-engine-client'
  import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
  import { FlarePluginStore } from '../store/defFlarePluginStore'
  import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
  import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
  import { FlareSpawnMessage } from '../message/flareSpawnMessage'
  import { Flare } from '../domain/flare'
  import { FlareHitMessage } from '../message/flareHitMessage'
  import { WeaponDamageMessage } from '@churaverse/player-plugin-client/message/weaponDamageMessage'
  import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
  import { FlareDamageCause } from '../domain/flareDamageCause'
  
  export class SocketController extends BaseSocketController<IMainScene> {
    private flarePluginStore!: FlarePluginStore
    private playerPluginStore!: PlayerPluginStore
  
    public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
      super(eventBus, store)
      eventBus.subscribeEvent('init', this.getStores.bind(this))
    }
  
    private getStores(): void {
      this.flarePluginStore = this.store.of('flarePlugin')
      this.playerPluginStore = this.store.of('playerPlugin')
    }
  
    public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
      ev.messageRegister.registerMessage('flareSpawn', FlareSpawnMessage, 'queue')
      ev.messageRegister.registerMessage('flareHit', FlareHitMessage, 'queue')
    }
  
    public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
      ev.messageListenerRegister.on('flareSpawn', this.flareSpawn.bind(this))
      ev.messageListenerRegister.on('flareHit', this.flareHit.bind(this))
      ev.messageListenerRegister.on('weaponDamage', this.flareDamage.bind(this))
    }
  
    private flareSpawn(msg: FlareSpawnMessage, senderId: string): void {
      const data = msg.data
      const pos = new Position(data.startPos.x, data.startPos.y)
      const flare = new Flare(data.flareId, senderId, pos, data.direction, data.spawnTime)
      const flareSpawnEvent = new EntitySpawnEvent(flare)
      this.eventBus.post(flareSpawnEvent)
    }
  
    private flareHit(msg: FlareHitMessage): void {
      const data = msg.data
      const flare = this.flarePluginStore.flares.get(data.flareId)
      if (flare === undefined) return
      const flareDespawnEvent = new EntityDespawnEvent(flare)
      this.eventBus.post(flareDespawnEvent)
    }
  
    private flareDamage(msg: WeaponDamageMessage): void {
      const data = msg.data
      if (data.cause !== 'flare') return
      const target = this.playerPluginStore.players.get(data.targetId)
      const flare = this.flarePluginStore.flares.get(data.weaponId)
      const attacker = flare?.ownerId
      if (target === undefined || flare === undefined || attacker === undefined) return
      const flareDamageCause = new FlareDamageCause(flare)
      const livingDamageEvent = new LivingDamageEvent(target, flareDamageCause, data.amount)
      this.eventBus.post(livingDamageEvent)
    }
  }
  