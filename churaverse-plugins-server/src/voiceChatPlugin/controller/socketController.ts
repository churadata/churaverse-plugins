import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { PriorDataRequestMessage } from '@churaverse/network-plugin-server/message/priorDataMessage'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { ToggleMegaphoneEvent } from '../event/toggleMegaphoneEvent'
import { ToggleMicEvent } from '../event/toggleMicEvent'
import { ExistPlayersMegaphone, PriorPlayersMegaphoneMessage } from '../message/priorPlayersMegaphoneMessage'
import { ExistPlayersMic, PriorPlayersMicMessage } from '../message/priorPlayersMicMessage'
import { ToggleMegaphoneMessage } from '../message/toggleMegaphoneMessage'
import { ToggleMicMessage } from '../message/toggleMicMessage'
import { VoiceChatPluginStore } from '../store/defVoiceChatPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private voiceChatPluginStore!: VoiceChatPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorPlayersMicData', PriorPlayersMicMessage, 'onlySelf')
    ev.messageRegister.registerMessage('priorPlayersMegaphoneData', PriorPlayersMegaphoneMessage, 'onlySelf')
    ev.messageRegister.registerMessage('toggleMic', ToggleMicMessage, 'onlyServer')
    ev.messageRegister.registerMessage('toggleMegaphone', ToggleMegaphoneMessage, 'others')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorPlayersMic.bind(this))
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorPlayersMegaphone.bind(this))
    ev.messageListenerRegister.on('toggleMic', this.toggleMic.bind(this))
    ev.messageListenerRegister.on('toggleMegaphone', this.toggleMegaphone.bind(this))
  }

  private getStores(): void {
    this.voiceChatPluginStore = this.store.of('voiceChatPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private sendPriorPlayersMic(msg: PriorDataRequestMessage, senderId: string): void {
    const playersMic = this.voiceChatPluginStore.playersMic
    const existPlayersMic: ExistPlayersMic = {}
    for (const id of playersMic.getAllId()) {
      const isUnmute = playersMic.get(id)
      if (isUnmute === undefined) continue
      existPlayersMic[id] = isUnmute
    }
    this.networkPluginStore.messageSender.send(new PriorPlayersMicMessage({ existPlayersMic }), senderId)
  }

  private sendPriorPlayersMegaphone(msg: PriorDataRequestMessage, senderId: string): void {
    const playersMegaphone = this.voiceChatPluginStore.playersMegaphone
    const existPlayersMegaphone: ExistPlayersMegaphone = {}
    for (const id of playersMegaphone.getAllId()) {
      const active = playersMegaphone.get(id)
      if (active === undefined) continue
      existPlayersMegaphone[id] = active
    }
    this.networkPluginStore.messageSender.send(new PriorPlayersMegaphoneMessage({ existPlayersMegaphone }), senderId)
  }

  private toggleMic(msg: ToggleMicMessage): void {
    const data = msg.data
    this.eventBus.post(new ToggleMicEvent(data.playerId, data.isUnmute))
  }

  private toggleMegaphone(msg: ToggleMegaphoneMessage): void {
    const data = msg.data
    this.eventBus.post(new ToggleMegaphoneEvent(data.playerId, data.active))
  }
}
