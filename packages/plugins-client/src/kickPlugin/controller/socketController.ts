import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { RequestKickPlayerEvent } from '../event/requestKickPlayerEvent'
import { RequestKickPlayerMessage } from '../message/requestKickPlayerMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('requestKickPlayer', RequestKickPlayerMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestKickPlayer', this.receiveKickRequest.bind(this))
  }

  private receiveKickRequest(msg: RequestKickPlayerMessage): void {
    const kickedPlayer = this.playerPluginStore.players.get(msg.data.kickedId)
    const kickerPlayer = this.playerPluginStore.players.get(msg.data.kickerId)

    if (kickedPlayer !== undefined && kickerPlayer !== undefined) {
      this.eventBus.post(new RequestKickPlayerEvent(kickedPlayer, kickerPlayer))
    }
  }
}
