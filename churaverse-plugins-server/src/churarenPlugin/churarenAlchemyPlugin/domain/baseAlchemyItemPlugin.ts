import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import '@churaverse/churaren-core-plugin-server/event/churarenStartCountdownEvent'
import { IAlchemyItem } from '../interface/IAlchemyItem'
import '../store/defAlchemyPluginStore'

/**
 * 錬金アイテムのプラグインのベースクラス
 * @property {IAlchemyItem} alchemyItem 錬金アイテムの情報
 */
export abstract class BaseAlchemyItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected abstract alchemyItem: IAlchemyItem

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartCountdown', this.setupAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.setupAlchemyItem)
  }

  private readonly setupAlchemyItem = (): void => {
    this.store.of('alchemyPlugin').alchemyItemRecipe.set(this.alchemyItem.recipe, this.alchemyItem.kind)
  }
}
