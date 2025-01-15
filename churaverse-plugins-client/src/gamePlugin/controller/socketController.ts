import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { RequestGameStartMessage, ResponseGameStartMessage } from '../message/gameStartMessage'
import { GameStartEvent } from '../event/gameStartEvent'
import { RequestGameEndMessage, ResponseGameEndMessage } from '../message/gameEndMessage'
import { GameEndEvent } from '../event/gameEndEvent'
import { RequestGameAbortMessage, ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { UpdateGameParticipantMessage } from '../message/updateGameParticipantMessage'
import { UpdateGameParticipantEvent } from '../event/updateGameParticipantEvent'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorGameData', PriorGameDataMessage, 'queue')
    ev.messageRegister.registerMessage('requestGameStart', RequestGameStartMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameStart', ResponseGameStartMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('requestGameEnd', RequestGameEndMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameEnd', ResponseGameEndMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('requestGameAbort', RequestGameAbortMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameAbort', ResponseGameAbortMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('updateGameParticipant', UpdateGameParticipantMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('priorGameData', this.priorGameData.bind(this))
    ev.messageListenerRegister.on('responseGameStart', this.gameStart.bind(this))
    ev.messageListenerRegister.on('responseGameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('responseGameAbort', this.gameAbort.bind(this))
    ev.messageListenerRegister.on('updateGameParticipant', this.gameParticipant.bind(this))
  }

  /**
   * 途中参加のプレイヤーに進行中のゲームを通知する
   * イベントを発火し、それぞれのゲームプラグインで処理を行う
   */
  private priorGameData(msg: PriorGameDataMessage): void {
    this.eventBus.post(new PriorGameDataEvent(msg.data.runningGameId))
  }

  private gameStart(msg: ResponseGameStartMessage): void {
    this.eventBus.post(new GameStartEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameEnd(msg: ResponseGameEndMessage): void {
    this.eventBus.post(new GameEndEvent(msg.data.gameId))
  }

  private gameAbort(msg: ResponseGameAbortMessage): void {
    this.eventBus.post(new GameAbortEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameParticipant(msg: UpdateGameParticipantMessage): void {
    this.eventBus.post(new UpdateGameParticipantEvent(msg.data.gameId, msg.data.participantIds))
  }
}
