import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { ChurarenPlayerReadyMessage } from '../message/churarenPlayerReadyMessage'
import { UpdateChurarenUiMessage } from '../message/updateChurarenUiMessage'
import { UpdateChurarenUiEvent } from '../event/updateChurarenUiEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenPlayerReady', ChurarenPlayerReadyMessage, 'queue')
    ev.messageRegister.registerMessage('updateChurarenUi', UpdateChurarenUiMessage, 'dest=onlySelf')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('updateChurarenUi', this.updateChurarenUi)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('updateChurarenUi', this.updateChurarenUi)
  }

  public updateChurarenUi = (msg: UpdateChurarenUiMessage): void => {
    const uiType = msg.data.uiType
    this.eventBus.post(new UpdateChurarenUiEvent(uiType))
  }
}
