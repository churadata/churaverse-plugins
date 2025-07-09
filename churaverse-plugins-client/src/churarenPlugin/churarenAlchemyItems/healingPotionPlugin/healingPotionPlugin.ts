import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { healignPotion, HEALING_POTION_ITEM, HealingPotion } from './domain/healingPotion'
import { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client/event/useAlchemyItemEvent'
import { initHealingPotionPluginStore, resetHealingPotionPluginStore } from './store/initHealingPotionPluginStore'
import { HealingPotionPluginStore } from './store/defHealingPotionPluginStore'
import { ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client/event/clearAlchemyItemBox'
import '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { UseHealingPotionMessage } from './message/useHealingPotionMessage'
import { SocketController } from './controller/socketController'

export class HealingPotionPlugin extends BaseAlchemyItemPlugin {
  private healingPotionPluginStore!: HealingPotionPluginStore
  private socketController?: SocketController
  protected alchemyItemKind = healignPotion
  protected alchemyItem = HEALING_POTION_ITEM

  public listenEvent(): void {
    super.listenEvent()

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
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
    initHealingPotionPluginStore(this.store)
    this.healingPotionPluginStore = this.store.of('churarenHealingPotionPlugin')
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    resetHealingPotionPluginStore(this.store)
  }

  protected handleMidwayParticipant(): void {
    this.unsubscribeGameEvent()
  }

  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'healingPotion') return
    const healingPotion = new HealingPotion(
      ev.alchemyItem.itemId,
      ev.ownPlayer.id,
      ev.ownPlayer.position,
      ev.ownPlayer.direction,
      Date.now()
    )
    this.healingPotionPluginStore.healingPotions.set(healingPotion.healingPotionId, healingPotion)

    if (healingPotion.ownerId === this.store.of('playerPlugin').ownPlayerId) {
      const healingPotionMessage = new UseHealingPotionMessage({
        playerId: healingPotion.ownerId,
        healAmount: healingPotion.heal,
      })
      this.store.of('networkPlugin').messageSender.send(healingPotionMessage)
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }
}
