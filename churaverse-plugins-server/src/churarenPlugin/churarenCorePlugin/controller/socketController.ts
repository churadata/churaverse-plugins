import { IMainScene } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { ChurarenPlayerReadyMessage } from '../message/churarenPlayerReadyMessage'
import { ChurarenStartCountdownMessage } from '../message/churarenStartCountdownMessage'
import { ChurarenStartTimerMessage } from '../message/churarenStartTimerMessage'
import { ChurarenResultMessage } from '../message/churarenResultMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenPlayerReady', ChurarenPlayerReadyMessage, 'onlyServer')
    ev.messageRegister.registerMessage('churarenStartCountdown', ChurarenStartCountdownMessage, 'allClients')
    ev.messageRegister.registerMessage('churarenStartTimer', ChurarenStartTimerMessage, 'onlyServer')
    ev.messageRegister.registerMessage('churarenResult', ChurarenResultMessage, 'allClients')
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
    this.store.of('churarenPlugin').readyPlayers.set(msg.data.playerId)
  }
}
