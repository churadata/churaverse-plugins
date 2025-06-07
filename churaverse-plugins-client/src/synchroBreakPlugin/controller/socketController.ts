import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { SynchroBreakTurnSelectMessage } from '../message/synchroBreakTurnSelectMessage'
import { SynchroBreakTurnSelectEvent } from '../event/synchroBreakTurnSelectEvent'
import { TimeLimitConfirmMessage } from '../message/timeLimitConfirmMessage'
import { TimeLimitConfirmEvent } from '../event/timeLimitConfirmEvent'
import { SendBetCoinMessage } from '../message/sendBetCoinMessage'
import { SendBetCoinResponseMessage } from '../message/sendBetCoinResponseMessage'
import { SendBetCoinResponseEvent } from '../event/sendBetCoinResponseEvent'
import { SynchroBreakStartCountMessage } from '../message/synchroBreakStartCountMessage'
import { SynchroBreakStartCountEvent } from '../event/synchroBreakStartCountEvent'
import { SynchroBreakTurnTimerMessage } from '../message/synchroBreakTurnTimerMessage'
import { SynchroBreakTurnTimerEvent } from '../event/synchroBreakTurnTimerEvent'
import { NyokkiMessage } from '../message/nyokkiMessage'
import { NyokkiActionResponseMessage } from '../message/nyokkiActionResponseMessage'
import { NyokkiActionResponseEvent } from '../event/nyokkiActionResponseEvent'
import { SynchroBreakTurnEndMessage } from '../message/synchroBreakTurnEndMessage'
import { SynchroBreakTurnEndEvent } from '../event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnStartMessage } from '../message/synchroBreakTurnStartMessage'
import { SynchroBreakTurnStartEvent } from '../event/synchroBerakTurnStartEvent'
import { UpdatePlayersCoinMessage } from '../message/updatePlayersCoinMessage'
import { UpdatePlayersCoinEvent } from '../event/updatePlayersCoinEvent'
import { SynchroBreakResultMessage } from '../message/synchroBreakResultMessage'
import { SynchroBreakResultEvent } from '../event/synchroBreakResultEvent'
import { SynchroBreakEndMessage } from '../message/synchroBreakEndMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('synchroBreakTurnSelect', SynchroBreakTurnSelectMessage, 'queue')
    ev.messageRegister.registerMessage('timeLimitConfirm', TimeLimitConfirmMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoin', SendBetCoinMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoinResponse', SendBetCoinResponseMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakStartCount', SynchroBreakStartCountMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakTurnTimer', SynchroBreakTurnTimerMessage, 'queue')
    ev.messageRegister.registerMessage('nyokki', NyokkiMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiActionResponse', NyokkiActionResponseMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakTurnEnd', SynchroBreakTurnEndMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakTurnStart', SynchroBreakTurnStartMessage, 'queue')
    ev.messageRegister.registerMessage('updatePlayersCoin', UpdatePlayersCoinMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakResult', SynchroBreakResultMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakEnd', SynchroBreakEndMessage, 'queue')
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
    this.messageListenerRegister.on('sendBetCoinResponse', this.sendBetCoinResponse)
    this.messageListenerRegister.on('synchroBreakStartCount', this.gameStartCount)
    this.messageListenerRegister.on('synchroBreakTurnTimer', this.turnTimer)
    this.messageListenerRegister.on('nyokkiActionResponse', this.nyokkiActionResponse)
    this.messageListenerRegister.on('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.messageListenerRegister.on('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.messageListenerRegister.on('updatePlayersCoin', this.updatePlayersCoin)
    this.messageListenerRegister.on('synchroBreakResult', this.synchroBreakResult)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.messageListenerRegister.off('timeLimitConfirm', this.timeLimitConfirm)
    this.messageListenerRegister.off('sendBetCoinResponse', this.sendBetCoinResponse)
    this.messageListenerRegister.off('synchroBreakStartCount', this.gameStartCount)
    this.messageListenerRegister.off('synchroBreakTurnTimer', this.turnTimer)
    this.messageListenerRegister.off('nyokkiActionResponse', this.nyokkiActionResponse)
    this.messageListenerRegister.off('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.messageListenerRegister.off('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.messageListenerRegister.off('updatePlayersCoin', this.updatePlayersCoin)
    this.messageListenerRegister.off('synchroBreakResult', this.synchroBreakResult)
  }

  private readonly synchroBreakTurnSelect = (msg: SynchroBreakTurnSelectMessage): void => {
    this.eventBus.post(new SynchroBreakTurnSelectEvent(msg.data.playerId, msg.data.allTurn))
  }

  private readonly timeLimitConfirm = (msg: TimeLimitConfirmMessage): void => {
    this.eventBus.post(new TimeLimitConfirmEvent(msg.data.playerId, msg.data.timeLimit))
  }

  private readonly sendBetCoinResponse = (msg: SendBetCoinResponseMessage): void => {
    this.eventBus.post(new SendBetCoinResponseEvent(msg.data.playerId, msg.data.betCoins, msg.data.currentCoins))
  }

  private readonly gameStartCount = (msg: SynchroBreakStartCountMessage): void => {
    this.eventBus.post(new SynchroBreakStartCountEvent(msg.data.remainingSeconds))
  }

  private readonly turnTimer = (msg: SynchroBreakTurnTimerMessage): void => {
    this.eventBus.post(new SynchroBreakTurnTimerEvent(msg.data.remainingSeconds))
  }

  private readonly nyokkiActionResponse = (msg: NyokkiActionResponseMessage): void => {
    this.eventBus.post(
      new NyokkiActionResponseEvent(
        msg.data.sameTimePlayersId,
        msg.data.isSuccess,
        msg.data.nyokkiLogText,
        msg.data.order
      )
    )
  }

  private readonly synchroBreakTurnEnd = (msg: SynchroBreakTurnEndMessage): void => {
    this.eventBus.post(new SynchroBreakTurnEndEvent(msg.data.noNyokkiPlayerIds))
  }

  private readonly synchroBreakTurnStart = (msg: SynchroBreakTurnStartMessage): void => {
    this.eventBus.post(new SynchroBreakTurnStartEvent(msg.data.turnNumber))
  }

  private readonly updatePlayersCoin = (msg: UpdatePlayersCoinMessage): void => {
    this.eventBus.post(new UpdatePlayersCoinEvent(msg.data.playersCoin))
  }

  private readonly synchroBreakResult = (): void => {
    this.eventBus.post(new SynchroBreakResultEvent())
  }
}
