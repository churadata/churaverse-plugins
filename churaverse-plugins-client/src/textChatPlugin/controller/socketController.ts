import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { TextChat } from '../model/textChat'
import { AddTextChatEvent } from '../event/addTextChatEvent'
import { SendTextChatMessage } from '../message/sendTextChatMessage'
import { OwnPlayerUndefinedError } from '@churaverse/player-plugin-client/errors/ownPlayerUndefinedError'
import '@churaverse/player-plugin-client/store/defPlayerPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sendTextChatMessage', SendTextChatMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('sendTextChatMessage', this.addTextChat.bind(this))
  }

  public addTextChat(msg: SendTextChatMessage): void {
    const textChatInfo = msg.data
    const playerId = textChatInfo.playerId
    const player = this.store.of('playerPlugin').players.get(playerId)
    if (player === undefined) throw new OwnPlayerUndefinedError()
    const textChat = new TextChat(playerId, player.name, textChatInfo.message)
    const addTextChatEvent = new AddTextChatEvent(textChat)

    this.eventBus.post(addTextChatEvent)
  }
}
