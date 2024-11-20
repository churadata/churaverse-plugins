import { IMainScene } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import '@churaverse/network-plugin-server/message/priorDataMessage'
import { GameStartMessage } from '../message/gameStartMessage'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameEndMessage } from '../message/gameEndMessage'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameAbortMessage } from '../message/gameAbortMessage'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { UpdateGameStateMessage } from '../message/updateGameStateMessage'
import { UpdateGameStateEvent } from '../event/updateGameStateEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorGameData', PriorGameDataMessage, 'others')
    ev.messageRegister.registerMessage('updateGameState', UpdateGameStateMessage, 'onlyServer')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'others')
    ev.messageRegister.registerMessage('gameEnd', GameEndMessage, 'others')
    ev.messageRegister.registerMessage('gameAbort', GameAbortMessage, 'others')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorGameData.bind(this))
    ev.messageListenerRegister.on('updateGameState', this.updateGameState.bind(this))
    ev.messageListenerRegister.on('gameStart', this.gameStart.bind(this))
    ev.messageListenerRegister.on('gameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('gameAbort', this.gameAbort.bind(this))
  }

  /**
   * 途中参加のプレイヤーに進行中のゲームを通知する
   * イベントを発火し、それぞれのゲームプラグインで処理を行う
   */
  private sendPriorGameData(): void {
    this.eventBus.post(new PriorGameDataEvent())
  }

  private updateGameState(msg: UpdateGameStateMessage): void {
    this.eventBus.post(new UpdateGameStateEvent(msg.data.gameId, msg.data.playerId, msg.data.toState))
  }

  private gameStart(msg: GameStartMessage): void {
    this.eventBus.post(new GameStartEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameEnd(msg: GameEndMessage): void {
    this.eventBus.post(new GameEndEvent(msg.data.gameId))
  }

  private gameAbort(msg: GameAbortMessage): void {
    this.eventBus.post(new GameAbortEvent(msg.data.gameId, msg.data.playerId))
  }
}
