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
import { InitialGameDataMessage } from '../message/initialGameDataMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('initialGameData', InitialGameDataMessage, 'others')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'others')
    ev.messageRegister.registerMessage('gameEnd', GameEndMessage, 'others')
    ev.messageRegister.registerMessage('gameAbort', GameAbortMessage, 'others')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendInitialGameData.bind(this))
    ev.messageListenerRegister.on('gameStart', this.gameStart.bind(this))
    ev.messageListenerRegister.on('gameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('gameAbort', this.gameAbort.bind(this))
  }

  private sendInitialGameData(): void {
    const runningGameIds = this.store.of('gamePlugin').gameRepository.getAllId()
    this.store.of('networkPlugin').messageSender.send(new InitialGameDataMessage({ runningGameIds }))
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
