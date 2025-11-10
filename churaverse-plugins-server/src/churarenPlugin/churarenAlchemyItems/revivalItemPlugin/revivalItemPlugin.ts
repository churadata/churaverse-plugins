import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { SocketController } from './controller/socketController'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/IAlchemyItem'

export const REVIVAL_ITEM: IAlchemyItem = {
  kind: 'revivalItem',
  recipe: {
    pattern: 'all_same',
    materialKind: 'herb',
  },
}

export class RevivalItemPlugin extends BaseAlchemyItemPlugin {
  private socketController?: SocketController
  protected alchemyItem = REVIVAL_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  // `UseRevivalItemEvent`は、`ChurarenPlayerPlugin`が処理する
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }
}
