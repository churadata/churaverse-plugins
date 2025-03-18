import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { ChurarenPlayerReadyMessage } from '../message/churarenPlayerReadyMessage'
import { ChurarenPlayerReadyEvent } from '../event/churarenPlayerReadyEvent'
import { UpdateChurarenUiMessage } from '../message/updateChurarenUiMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenPlayerReady', ChurarenPlayerReadyMessage, 'onlyServer')
    ev.messageRegister.registerMessage('updateChurarenUi', UpdateChurarenUiMessage, 'allClients')
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
    this.messageListenerRegister.on('churarenPlayerReady', this.onChurarenPlayerReady)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('churarenPlayerReady', this.onChurarenPlayerReady)
  }

  public onChurarenPlayerReady = (msg: ChurarenPlayerReadyMessage): void => {
    this.eventBus.post(new ChurarenPlayerReadyEvent(msg.data.playerId))
  }
}
