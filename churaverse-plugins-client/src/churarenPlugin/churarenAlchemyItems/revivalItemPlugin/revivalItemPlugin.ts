import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client/event/useAlchemyItemEvent'
import { ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client/event/clearAlchemyItemBox'
import { SocketController } from './controller/socketController'
import { REVIVAL_ITEM, RevivalItem, revivalItem } from './domain/revivalItem'
import { initRevivalPluginStore, resetRevivalPluginStore } from './store/initRevivalPluginStore'
import { RevivalItemPluginStore } from './store/defRevivalItemPluginStore'
import { UseRevivalItemMessage } from './message/useRevivalItemMessage'

export class RevivalItemPlugin extends BaseAlchemyItemPlugin {
  private revivalItemPluginStore!: RevivalItemPluginStore
  private socketController?: SocketController
  protected alchemyItemKind = revivalItem
  protected alchemyItem = REVIVAL_ITEM

  public listenEvent(): void {
    super.listenEvent()

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
  }

  protected handleGameStart(): void {
    initRevivalPluginStore(this.store)
    this.revivalItemPluginStore = this.store.of('churarenRevivalItemPlugin')
  }

  protected handleGameTermination(): void {
    resetRevivalPluginStore(this.store)
  }

  protected handleMidwayParticipant(): void {
    this.unsubscribeGameEvent()
  }

  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'revivalItem') return
    const revival = new RevivalItem(
      ev.alchemyItem.itemId,
      ev.ownPlayer.id,
      ev.ownPlayer.position,
      ev.ownPlayer.direction,
      Date.now()
    )
    this.revivalItemPluginStore.revivalItems.set(revival.revivalItemId, revival)

    if (revival.ownerId === this.store.of('playerPlugin').ownPlayerId) {
      const useRevivalItemMessage = new UseRevivalItemMessage({ playerId: revival.ownerId })
      this.store.of('networkPlugin').messageSender.send(useRevivalItemMessage)
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }
}
