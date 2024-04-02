import {
  IMainScene,
  BasePlugin,
  EntityDespawnEvent,
  InitEvent,
  UpdateEvent,
  LivingDamageEvent,
  EntitySpawnEvent,
  WeaponDamageCause,
  Vector,
} from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { initPlayerPluginStore } from './store/initPlayerPluginStore'
import { PLAYER_RESPAWN_WAITING_TIME_MS, Player } from './domain/player'
import { PlayerPluginStore } from './store/defPlayerPluginStore'
import { NetworkDisconnectEvent } from '@churaverse/network-plugin-server/event/networkDisconnectEvent'
import { PlayerWalkEvent } from './event/playerWalkEvent'
import { PlayerStopEvent } from './event/playerStopEvent'
import { PlayerTurnEvent } from './event/playerTurnEvent'
import { PlayerNameChangeEvent } from './event/playerNameChangeEvent'
import { PlayerColorChangeEvent } from './event/playerColorChangeEvent'
import { movePlayers } from './domain/playerService'
import { WeaponDamageMessage } from './message/weaponDamageMessage'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { PlayerDieMessage } from './message/playerDieMessage'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { PlayerRespawnMessage } from './message/playerRespawnMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export class PlayerPlugin extends BasePlugin<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private mapPluginStore!: MapPluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
    this.bus.subscribeEvent('networkDisconnect', this.postPlayerLeaveEvent.bind(this))

    this.bus.subscribeEvent('entitySpawn', this.onPlayerJoin.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave.bind(this))
    this.bus.subscribeEvent('playerWalk', this.onPlayerWalk.bind(this))
    this.bus.subscribeEvent('playerStop', this.onPlayerStop.bind(this))
    this.bus.subscribeEvent('playerTurn', this.onPlayerTurn.bind(this))
    this.bus.subscribeEvent('playerNameChange', this.onPlayerNameChange.bind(this))
    this.bus.subscribeEvent('playerColorChange', this.onPlayerColorChange.bind(this))
    this.bus.subscribeEvent('livingDamage', this.onLivingDamage.bind(this))
  }

  private init(ev: InitEvent): void {
    initPlayerPluginStore(this.store)
    this.getStores()
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
  }

  private update(ev: UpdateEvent): void {
    movePlayers(ev.dt, this.playerPluginStore.players)
  }

  private onPlayerJoin(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    const player = ev.entity
    this.playerPluginStore.players.set(player.id, player)
  }

  private postPlayerLeaveEvent(ev: NetworkDisconnectEvent): void {
    const leavePlayer = this.playerPluginStore.players.get(ev.socketId)

    // mainScene以外で通信切断した場合leavePlayerはundefined
    if (leavePlayer === undefined) return

    const leaveEvent = new EntityDespawnEvent(leavePlayer)
    this.bus.post(leaveEvent)
  }

  private onPlayerLeave(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    this.playerPluginStore.players.delete(ev.entity.id)
  }

  private onPlayerWalk(ev: PlayerWalkEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return
    if (player.isDead) {
      player.stop()
    } else {
      const velocity = { x: ev.speed * ev.direction.x, y: ev.speed * ev.direction.y }
      player.walk(ev.position, ev.direction, velocity)
    }
  }

  private onPlayerStop(ev: PlayerStopEvent): void {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return
    player.stop()

    // 位置・向きを補正
    player.teleport(ev.position)
    player.turn(ev.direction)
  }

  private onPlayerTurn(ev: PlayerTurnEvent): void {
    this.playerPluginStore.players.get(ev.id)?.turn(ev.direction)
  }

  private onPlayerNameChange(ev: PlayerNameChangeEvent): void {
    this.playerPluginStore.players.get(ev.id)?.setPlayerName(ev.name)
  }

  private onPlayerColorChange(ev: PlayerColorChangeEvent): void {
    this.playerPluginStore.players.get(ev.id)?.setPlayerColor(ev.color)
  }

  private onLivingDamage(ev: LivingDamageEvent): void {
    if (!(ev.target instanceof Player)) return

    const player = this.playerPluginStore.players.get(ev.target.id)
    if (player === undefined) return

    player.damage(ev.amount)
    if (ev.cause instanceof WeaponDamageCause) {
      const weaponDamageMessage = new WeaponDamageMessage({
        targetId: ev.target.id,
        cause: ev.cause.weaponName,
        weaponId: ev.cause.weapon.id,
        amount: ev.amount,
      })
      this.networkPluginStore.messageSender.send(weaponDamageMessage)
    }

    if (player.isDead) {
      player.stop()

      const playerDieMessage = new PlayerDieMessage({ targetId: ev.target.id })
      this.networkPluginStore.messageSender.send(playerDieMessage)

      // PLAYER_RESPAWN_WAITING_TIME_MS後にリスポーン
      setTimeout(() => {
        // ランダムな通行可能マスの座標を取得
        const position = this.mapPluginStore.mapManager.currentMap.getRandomSpawnPoint()
        player.respawn(position)

        const playerRespawnMessage = new PlayerRespawnMessage({
          playerId: player.id,
          position: player.position.toVector() as Vector & SendableObject,
          direction: player.direction,
        })
        this.networkPluginStore.messageSender.send(playerRespawnMessage)
      }, PLAYER_RESPAWN_WAITING_TIME_MS)
    }
  }
}
