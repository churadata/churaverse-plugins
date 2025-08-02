import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { SynchroBreakTurnSelectMessage } from '../message/synchroBreakTurnSelectMessage'
import { SynchroBreakTurnSelectEvent } from '../event/synchroBreakTurnSelectEvent'
import { TimeLimitConfirmMessage } from '../message/timeLimitConfirmMessage'
import { TimeLimitConfirmEvent } from '../event/timeLimitConfirmEvent'
import { SendBetCoinMessage } from '../message/sendBetCoinMessage'
import { SendBetCoinEvent } from '../event/sendBetCoinEvent'
import { SendBetCoinResponseMessage } from '../message/sendBetCoinResponseMessage'
import { SynchroBreakStartCountMessage } from '../message/synchroBreakStartCountMessage'
import { SynchroBreakTurnTimerMessage } from '../message/synchroBreakTurnTimerMessage'
import { NyokkiMessage } from '../message/nyokkiMessage'
import { NyokkiEvent } from '../event/nyokkiEvent'
import { NyokkiActionResponseMessage } from '../message/nyokkiActionResponseMessage'
import { SynchroBreakTurnEndMessage } from '../message/synchroBreakTurnEndMessage'
import { SynchroBreakTurnStartMessage } from '../message/synchroBreakTurnStartMessage'
import { UpdatePlayersCoinMessage } from '../message/updatePlayersCoinMessage'
import { SynchroBreakResultMessage } from '../message/synchroBreakResultMessage'
import { BetTimeRemainingMessage } from '../message/betTimeRemainingMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('synchroBreakTurnSelect', SynchroBreakTurnSelectMessage, 'allClients')
    ev.messageRegister.registerMessage('timeLimitConfirm', TimeLimitConfirmMessage, 'allClients')
    ev.messageRegister.registerMessage('sendBetCoin', SendBetCoinMessage, 'onlyServer')
    ev.messageRegister.registerMessage('sendBetCoinResponse', SendBetCoinResponseMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakStartCount', SynchroBreakStartCountMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakTurnTimer', SynchroBreakTurnTimerMessage, 'allClients')
    ev.messageRegister.registerMessage('nyokki', NyokkiMessage, 'onlyServer')
    ev.messageRegister.registerMessage('nyokkiActionResponse', NyokkiActionResponseMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakTurnEnd', SynchroBreakTurnEndMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakTurnStart', SynchroBreakTurnStartMessage, 'allClients')
    ev.messageRegister.registerMessage('updatePlayersCoin', UpdatePlayersCoinMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakResult', SynchroBreakResultMessage, 'allClients')
    ev.messageRegister.registerMessage('betTimeRemaining', BetTimeRemainingMessage, 'allClients')
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
    this.messageListenerRegister.on('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.messageListenerRegister.on('timeLimitConfirm', this.timeLimitConfirm)
    this.messageListenerRegister.on('sendBetCoin', this.sendBetCoin)
    this.messageListenerRegister.on('nyokki', this.nyokki)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.messageListenerRegister.off('timeLimitConfirm', this.timeLimitConfirm)
    this.messageListenerRegister.off('sendBetCoin', this.sendBetCoin)
    this.messageListenerRegister.off('nyokki', this.nyokki)
  }

  private readonly synchroBreakTurnSelect = (msg: SynchroBreakTurnSelectMessage): void => {
    this.eventBus.post(new SynchroBreakTurnSelectEvent(msg.data.allTurn))
  }

  private readonly timeLimitConfirm = (msg: TimeLimitConfirmMessage): void => {
    this.eventBus.post(new TimeLimitConfirmEvent(msg.data.playerId, msg.data.timeLimit))
  }

  private readonly sendBetCoin = (msg: SendBetCoinMessage): void => {
    this.eventBus.post(new SendBetCoinEvent(msg.data.playerId, msg.data.betCoins))
  }

  private readonly nyokki = (msg: NyokkiMessage): void => {
    this.eventBus.post(new NyokkiEvent(msg.data.playerId))
  }
}
