import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { NyokkiTurnSelectMessage } from '../message/nyokkiTurnSelectMessage'
import { NyokkiTurnSelectEvent } from '../event/nyokkiTurnSelectEvent'
import { TimeLimitConfirmMessage } from '../message/timeLimitConfirmMessage'
import { TimeLimitConfirmEvent } from '../event/timeLimitConfirmEvent'
import { SendBetCoinMessage } from '../message/sendBetCoinMessage'
import { SendBetCoinEvent } from '../event/sendBetCoinEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('nyokkiTurnSelect', NyokkiTurnSelectMessage, 'queue')
    ev.messageRegister.registerMessage('timeLimitConfirm', TimeLimitConfirmMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoin', SendBetCoinMessage, 'queue')
  }

  /**
   * messageListenerRegisterをセットアップする
   */
  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  /**
   * メッセージリスナーを登録する
   */
  public registerMessageListener(): void {
    this.messageListenerRegister.on('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.messageListenerRegister.on('timeLimitConfirm', this.timeLimitConfirm)
    this.messageListenerRegister.on('sendBetCoin', this.sendBetCoin)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.messageListenerRegister.off('timeLimitConfirm', this.timeLimitConfirm)
    this.messageListenerRegister.off('sendBetCoin', this.sendBetCoin)
  }

  private readonly nyokkiTurnSelect = (msg: NyokkiTurnSelectMessage): void => {
    this.eventBus.post(new NyokkiTurnSelectEvent(msg.data.playerId, msg.data.allTurn))
  }

  private readonly timeLimitConfirm = (msg: TimeLimitConfirmMessage): void => {
    this.eventBus.post(new TimeLimitConfirmEvent(msg.data.playerId, msg.data.timeLimit))
  }

  private readonly sendBetCoin = (msg: SendBetCoinMessage): void => {
    this.eventBus.post(new SendBetCoinEvent(msg.data.playerId, msg.data.betCoins))
  }
}
