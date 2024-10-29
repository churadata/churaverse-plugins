import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { GameStartMessage } from '../message/gameStartMessage'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameEndMessage } from '../message/gameEndMessage'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameAbortMessage } from '../message/gameAbortMessage'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { InitialGameDataMessage } from '../message/initialGameDataMessage'
import { InitialGameDataEvent } from '../event/initialGameDataEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('initialGameData', InitialGameDataMessage, 'queue')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'queue')
    ev.messageRegister.registerMessage('gameEnd', GameEndMessage, 'queue')
    ev.messageRegister.registerMessage('gameAbort', GameAbortMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('initialGameData', this.initialGameData.bind(this))
    ev.messageListenerRegister.on('gameStart', this.gameStart.bind(this))
    ev.messageListenerRegister.on('gameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('gameAbort', this.gameAbort.bind(this))
  }

  private initialGameData(msg: InitialGameDataMessage): void {
    this.eventBus.post(new InitialGameDataEvent(msg.data.runningGameIds))
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
