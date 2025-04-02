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
import { SendBetCoinResponseMessage } from '../message/sendBetCoinResponseMessage'
import { SendBetCoinResponseEvent } from '../event/sendBetCoinResponseEvent'
import { NyokkiGameStartCountMessage } from '../message/nyokkiGameStartCountMessage'
import { NyokkiGameStartCountEvent } from '../event/nyokkiGameStartCountEvent'
import { NyokkiTurnTimerMessage } from '../message/nyokkiTurnTimerMessage'
import { NyokkiTurnTimerEvent } from '../event/nyokkiTurnTimerEvent'
import { NyokkiMessage } from '../message/nyokkiMessage'
import { NyokkiActionResponseMessage } from '../message/nyokkiActionResponseMessage'
import { NyokkiActionResponseEvent } from '../event/nyokkiActionResponseEvent'
import { NyokkiTurnEndMessage } from '../message/nyokkiTurnEndMessage'
import { NyokkiTurnEndEvent } from '../event/nyokkiTurnEndEvent'
import { NyokkiTurnStartMessage } from '../message/nyokkiTurnStartMessage'
import { NyokkiTurnStartEvent } from '../event/nyokkiTurnStartEvent'
import { UpdatePlayersCoinMessage } from '../message/updatePlayersCoinMessage'
import { UpdatePlayersCoinEvent } from '../event/updatePlayersCoinEvent'
export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('nyokkiTurnSelect', NyokkiTurnSelectMessage, 'queue')
    ev.messageRegister.registerMessage('timeLimitConfirm', TimeLimitConfirmMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoin', SendBetCoinMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoinResponse', SendBetCoinResponseMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiGameStartCount', NyokkiGameStartCountMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiTurnTimer', NyokkiTurnTimerMessage, 'queue')
    ev.messageRegister.registerMessage('nyokki', NyokkiMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiActionResponse', NyokkiActionResponseMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiTurnEnd', NyokkiTurnEndMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiTurnStart', NyokkiTurnStartMessage, 'queue')
    ev.messageRegister.registerMessage('updatePlayersCoin', UpdatePlayersCoinMessage, 'queue')
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
    this.messageListenerRegister.on('sendBetCoinResponse', this.sendBetCoinResponse)
    this.messageListenerRegister.on('nyokkiGameStartCount', this.gameStartCount)
    this.messageListenerRegister.on('nyokkiTurnTimer', this.turnTimer)
    this.messageListenerRegister.on('nyokkiActionResponse', this.nyokkiActionResponse)
    this.messageListenerRegister.on('nyokkiTurnEnd', this.nyokkiTurnEnd)
    this.messageListenerRegister.on('nyokkiTurnStart', this.nyokkiTurnStart)
    this.messageListenerRegister.on('updatePlayersCoin', this.updatePlayersCoin)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.messageListenerRegister.off('timeLimitConfirm', this.timeLimitConfirm)
    this.messageListenerRegister.off('sendBetCoinResponse', this.sendBetCoinResponse)
    this.messageListenerRegister.off('nyokkiGameStartCount', this.gameStartCount)
    this.messageListenerRegister.off('nyokkiTurnTimer', this.turnTimer)
    this.messageListenerRegister.off('nyokkiActionResponse', this.nyokkiActionResponse)
    this.messageListenerRegister.off('nyokkiTurnEnd', this.nyokkiTurnEnd)
    this.messageListenerRegister.off('nyokkiTurnStart', this.nyokkiTurnStart)
    this.messageListenerRegister.off('updatePlayersCoin', this.updatePlayersCoin)
  }

  private readonly nyokkiTurnSelect = (msg: NyokkiTurnSelectMessage): void => {
    this.eventBus.post(new NyokkiTurnSelectEvent(msg.data.playerId, msg.data.allTurn))
  }

  private readonly timeLimitConfirm = (msg: TimeLimitConfirmMessage): void => {
    this.eventBus.post(new TimeLimitConfirmEvent(msg.data.playerId, msg.data.timeLimit))
  }

  private readonly sendBetCoinResponse = (msg: SendBetCoinResponseMessage): void => {
    this.eventBus.post(new SendBetCoinResponseEvent(msg.data.playerId, msg.data.betCoins, msg.data.currentCoins))
  }

  private readonly gameStartCount = (msg: NyokkiGameStartCountMessage): void => {
    this.eventBus.post(new NyokkiGameStartCountEvent(msg.data.remainingSeconds))
  }

  private readonly turnTimer = (msg: NyokkiTurnTimerMessage): void => {
    this.eventBus.post(new NyokkiTurnTimerEvent(msg.data.remainingSeconds))
  }

  private readonly nyokkiActionResponse = (msg: NyokkiActionResponseMessage): void => {
    this.eventBus.post(
      new NyokkiActionResponseEvent(
        msg.data.sameTimePlayersId,
        msg.data.nyokkiStatus,
        msg.data.nyokkiLogText,
        msg.data.order
      )
    )
  }

  private readonly nyokkiTurnEnd = (msg: NyokkiTurnEndMessage): void => {
    this.eventBus.post(new NyokkiTurnEndEvent(msg.data.noNyokkiPlayerIds))
  }

  private readonly nyokkiTurnStart = (msg: NyokkiTurnStartMessage): void => {
    this.eventBus.post(new NyokkiTurnStartEvent(msg.data.turnNumber))
  }

  private readonly updatePlayersCoin = (msg: UpdatePlayersCoinMessage): void => {
    this.eventBus.post(new UpdatePlayersCoinEvent(msg.data.playersCoin))
  }
}
