import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { AlchemyItemRegisterEvent } from '@churaverse/churaren-item-plugin-server/event/alchemyItemRegisterEvent'
import { IAlchemyItem } from './IAlchemyItem'

/**
 * 錬金アイテムプラグインのベースクラス
 * 各錬金アイテムプラグインはこのクラスを継承し、`alchemyItem` プロパティを実装する必要がある。
 * @property {IAlchemyItem} alchemyItem - 錬金アイテムの情報を持つオブジェクト
 */
export abstract class BaseAlchemyItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected abstract alchemyItem: IAlchemyItem

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('alchemyItemRegister', this.onAlchemyItemRegister.bind(this))
  }

  private onAlchemyItemRegister(ev: AlchemyItemRegisterEvent): void {
    ev.alchemyItemRegister.register(this.alchemyItem.recipe, this.alchemyItem.kind)
  }
}
