import { IMainScene, IEventBus, Store, Position, EntitySpawnEvent, EntityDespawnEvent } from 'churaverse-engine-client'
import { Player } from '../domain/player'
import { PlayerWalkEvent } from '../event/playerWalkEvent'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { PlayerJoinMessage } from '../message/playerJoinMessage'
import { PlayerWalkMessage } from '../message/playerWalkMessage'
import { PlayerStopMessage } from '../message/playerStopMessage'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { PlayerPluginStore } from '../store/defPlayerPluginStore'
import { PlayerLeaveMessage } from '../message/playerLeaveMessage'
import { PriorPlayerDataMessage } from '../message/priorPlayerDataMessage'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { PlayerTurnMessage } from '../message/playerTurnMessage'
import { PlayerTurnEvent } from '../event/playerTurnEvent'
import { PlayerNameChangeMessage } from '../message/playerNameChangeMessage'
import { PlayerNameChangeEvent } from '../event/playerNameChangeEvent'
import { PlayerColorChangeMessage } from '../message/playerColorChangeMessage'
import { PlayerColorChangeEvent } from '../event/playerColorChangeEvent'
import { PlayerDieMessage } from '../message/playerDieMessage'
import { PlayerDieEvent } from '../event/playerDieEvent'
import { PlayerRespawnMessage } from '../message/playerRespawnMessage'
import { PlayerRespawnEvent } from '../event/playerRespawnEvent'
import { WeaponDamageMessage } from '../message/weaponDamageMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('playerJoin', PlayerJoinMessage, 'queue')
    ev.messageRegister.registerMessage('playerLeave', PlayerLeaveMessage, 'queue')
    ev.messageRegister.registerMessage('playerWalk', PlayerWalkMessage, 'lastOnly')
    ev.messageRegister.registerMessage('playerStop', PlayerStopMessage, 'lastOnly')
    ev.messageRegister.registerMessage('playerTurn', PlayerTurnMessage, 'lastOnly')
    ev.messageRegister.registerMessage('priorPlayerData', PriorPlayerDataMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('playerNameChange', PlayerNameChangeMessage, 'lastOnly')
    ev.messageRegister.registerMessage('playerColorChange', PlayerColorChangeMessage, 'lastOnly')
    ev.messageRegister.registerMessage('playerDie', PlayerDieMessage, 'queue')
    ev.messageRegister.registerMessage('playerRespawn', PlayerRespawnMessage, 'queue')
    ev.messageRegister.registerMessage('weaponDamage', WeaponDamageMessage, 'queue')

    // this.socket.listenEvent('disconnected', this.playerLeave.bind(this))
    // this.socket.listenAction('profile', this.playerProfileUpdate.bind(this))
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('priorPlayerData', this.receivePriorData.bind(this))
    ev.messageListenerRegister.on('playerJoin', this.playerJoin.bind(this))
    ev.messageListenerRegister.on('playerLeave', this.playerLeave.bind(this))
    ev.messageListenerRegister.on('playerWalk', this.playerWalk.bind(this))
    ev.messageListenerRegister.on('playerTurn', this.playerTurn.bind(this))
    ev.messageListenerRegister.on('playerNameChange', this.playerNameChange.bind(this))
    ev.messageListenerRegister.on('playerColorChange', this.playerColorChange.bind(this))
    ev.messageListenerRegister.on('playerDie', this.playerDie.bind(this))
    ev.messageListenerRegister.on('playerRespawn', this.playerRespawn.bind(this))
  }

  private receivePriorData(msg: PriorPlayerDataMessage): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId

    // 既存プレイヤーを追加
    for (const [id, playerData] of Object.entries(msg.data.existPlayers)) {
      if (id === ownPlayerId) continue

      const joinMessage = new PlayerJoinMessage(playerData)
      this.playerJoin(joinMessage)
    }
  }

  private playerJoin(msg: PlayerJoinMessage): void {
    const playerInfo = msg.data
    const pos = new Position(playerInfo.position.x, playerInfo.position.y)
    const newPlayer = new Player(
      playerInfo.playerId,
      pos,
      playerInfo.direction,
      playerInfo.heroName,
      playerInfo.heroColor,
      playerInfo.hp,
      playerInfo.role,
      playerInfo.spawnTime
    )
    const joinEvent = new EntitySpawnEvent(newPlayer)
    this.eventBus.post(joinEvent)
  }

  private playerLeave(msg: PlayerLeaveMessage): void {
    const player = this.playerPluginStore.players.get(msg.data.playerId)

    if (player !== undefined) {
      const leaveEvent = new EntityDespawnEvent(player)
      this.eventBus.post(leaveEvent)
    }
  }

  private playerWalk(msg: PlayerWalkMessage, senderId: string): void {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const walkEvent = new PlayerWalkEvent(senderId, data.direction, data.speed, pos)
    this.eventBus.post(walkEvent)
  }

  private playerTurn(msg: PlayerTurnMessage, senderId: string): void {
    const data = msg.data
    const turnEvent = new PlayerTurnEvent(senderId, data.direction)
    this.eventBus.post(turnEvent)
  }

  private playerNameChange(msg: PlayerNameChangeMessage, senderId: string): void {
    const data = msg.data
    const nameChangeEvent = new PlayerNameChangeEvent(senderId, data.name)
    this.eventBus.post(nameChangeEvent)
  }

  private playerColorChange(msg: PlayerColorChangeMessage, senderId: string): void {
    const data = msg.data
    const colorChangeEvent = new PlayerColorChangeEvent(senderId, data.color)
    this.eventBus.post(colorChangeEvent)
  }

  private playerDie(msg: PlayerDieMessage): void {
    const data = msg.data
    const dieEvent = new PlayerDieEvent(data.targetId)
    this.eventBus.post(dieEvent)
  }

  private playerRespawn(msg: PlayerRespawnMessage): void {
    const data = msg.data
    const respawnEvent = new PlayerRespawnEvent(
      data.playerId,
      new Position(data.position.x, data.position.y),
      data.direction
    )
    this.eventBus.post(respawnEvent)
  }
}
