import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { GameStartMessage } from '../message/gameStartMessage'
import { GameStartEvent } from '../event/gameStartEvent'
import { RequestGameEndMessage, ResponseGameEndMessage } from '../message/gameEndMessage'
import { GameEndEvent } from '../event/gameEndEvent'
import { RequestGameAbortMessage, ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GamePlayerQuitMessage } from '../message/gamePlayerQuitMessage'
import { RequestGameHostMessage, ResponseGameHostMessage } from '../message/gameHostMessage'
import { GameHostEvent } from '../event/gameHostEvent'
import { RequestGameMidwayJoinMessage, ResponseGameMidwayJoinMessage } from '../message/gameMidwayJoinMessage'
import { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import { SubmitGameJoinMessage } from '../message/submitGameJoinMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorGameData', PriorGameDataMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('requestGameHost', RequestGameHostMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameHost', ResponseGameHostMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('submitGameJoin', SubmitGameJoinMessage, 'queue')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('requestGameEnd', RequestGameEndMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameEnd', ResponseGameEndMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('requestGameAbort', RequestGameAbortMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameAbort', ResponseGameAbortMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('gamePlayerQuit', GamePlayerQuitMessage, 'lastOnly')
    ev.messageRegister.registerMessage('requestGameMidwayJoin', RequestGameMidwayJoinMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameMidwayJoin', ResponseGameMidwayJoinMessage, 'dest=onlySelf')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('priorGameData', this.priorGameData.bind(this))
    ev.messageListenerRegister.on('responseGameHost', this.gameHost.bind(this))
    ev.messageListenerRegister.on('gameStart', this.gameStart.bind(this))
    ev.messageListenerRegister.on('responseGameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('responseGameAbort', this.gameAbort.bind(this))
    ev.messageListenerRegister.on('responseGameMidwayJoin', this.gameMidwayJoin.bind(this))
  }

  /**
   * 途中参加のプレイヤーに進行中のゲームを通知する
   * イベントを発火し、それぞれのゲームプラグインで処理を行う
   */
  private priorGameData(msg: PriorGameDataMessage): void {
    this.eventBus.post(new PriorGameDataEvent(msg.data.runningGameId, msg.data.ownerId, msg.data.gameState))
  }

  private gameHost(msg: ResponseGameHostMessage): void {
    this.eventBus.post(new GameHostEvent(msg.data.gameId, msg.data.ownerId, msg.data.timeoutSec))
  }

  private gameStart(msg: GameStartMessage): void {
    this.eventBus.post(new GameStartEvent(msg.data.gameId, msg.data.ownerId, msg.data.participantIds))
  }

  private gameEnd(msg: ResponseGameEndMessage): void {
    this.eventBus.post(new GameEndEvent(msg.data.gameId))
  }

  private gameAbort(msg: ResponseGameAbortMessage): void {
    this.eventBus.post(new GameAbortEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameMidwayJoin(msg: ResponseGameMidwayJoinMessage): void {
    this.eventBus.post(new GameMidwayJoinEvent(msg.data.gameId, msg.data.joinPlayerId, msg.data.participantIds))
  }
}
