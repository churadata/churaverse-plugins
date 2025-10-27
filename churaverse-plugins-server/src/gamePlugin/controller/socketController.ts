import { IMainScene } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { PriorDataRequestMessage } from '@churaverse/network-plugin-server/message/priorDataMessage'
import { GameStartMessage } from '../message/gameStartMessage'
import { RequestGameEndMessage, ResponseGameEndMessage } from '../message/gameEndMessage'
import { GameEndEvent } from '../event/gameEndEvent'
import { RequestGameAbortMessage, ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { GamePlayerQuitMessage } from '../message/gamePlayerQuitMessage'
import { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import { RequestGameHostMessage, ResponseGameHostMessage } from '../message/gameHostMessage'
import { GameHostEvent } from '../event/gameHostEvent'
import { ParticipationResponseMessage } from '../message/participationResponseMessage'
import { ParticipationResponseEvent } from '../event/participationResponseEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorGameData', PriorGameDataMessage, 'onlySelf')
    ev.messageRegister.registerMessage('requestGameHost', RequestGameHostMessage, 'onlyServer')
    ev.messageRegister.registerMessage('responseGameHost', ResponseGameHostMessage, 'allClients')
    ev.messageRegister.registerMessage('participationResponse', ParticipationResponseMessage, 'onlyServer')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'allClients')
    ev.messageRegister.registerMessage('requestGameEnd', RequestGameEndMessage, 'onlySelf')
    ev.messageRegister.registerMessage('responseGameEnd', ResponseGameEndMessage, 'allClients')
    ev.messageRegister.registerMessage('requestGameAbort', RequestGameAbortMessage, 'onlySelf')
    ev.messageRegister.registerMessage('responseGameAbort', ResponseGameAbortMessage, 'allClients')
    ev.messageRegister.registerMessage('gamePlayerQuit', GamePlayerQuitMessage, 'onlySelf')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorGameData.bind(this))
    ev.messageListenerRegister.on('requestGameHost', this.gameHost.bind(this))
    ev.messageListenerRegister.on('participationResponse', this.participationResponse.bind(this))
    ev.messageListenerRegister.on('requestGameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('requestGameAbort', this.gameAbort.bind(this))
    ev.messageListenerRegister.on('gamePlayerQuit', this.gamePlayerQuit.bind(this))
  }

  /**
   * 途中参加のプレイヤーに進行中のゲームを通知する
   * イベントを発火し、それぞれのゲームプラグインで処理を行う
   */
  private sendPriorGameData(msg: PriorDataRequestMessage, senderId: string): void {
    this.eventBus.post(new PriorGameDataEvent(senderId))
  }

  private gameHost(msg: RequestGameHostMessage): void {
    this.eventBus.post(new GameHostEvent(msg.data.gameId, msg.data.ownerId))
  }

  private participationResponse(msg: ParticipationResponseMessage, senderId: string): void {
    this.eventBus.post(new ParticipationResponseEvent(msg.data.gameId, senderId, msg.data.isJoin))
  }

  private gameAbort(msg: RequestGameAbortMessage): void {
    this.eventBus.post(new GameAbortEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameEnd(msg: RequestGameEndMessage): void {
    this.eventBus.post(new GameEndEvent(msg.data.gameId))
  }

  private gamePlayerQuit(msg: GamePlayerQuitMessage): void {
    this.eventBus.post(new GamePlayerQuitEvent(msg.data.gameId, msg.data.playerId))
  }
}
