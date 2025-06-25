import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { PhaserLoadAssets } from 'churaverse-engine-client'
import { AlchemyItemManager } from '../alchemyItemManager'
import { UseAlchemyItemEvent } from '../event/useAlchemyItemEvent'
import { IAlchemyItem } from './IAlchemyItem'
import { AlchemyItemKind } from './alchemyItemKind'

/**
 * 錬金アイテムのプラグインのベースクラス
 */
export abstract class BaseAlchemyItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected alchemyItemManager!: AlchemyItemManager
  protected abstract alchemyItemKind: AlchemyItemKind
  protected abstract alchemyItem: IAlchemyItem

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAlchemyItemAssets.bind(this))
  }

  private loadAlchemyItemAssets(ev: PhaserLoadAssets): void {
    AlchemyItemManager.loadAssets(ev.scene, this.alchemyItemKind, this.alchemyItem.image)
  }

  /**
   * 錬金アイテムを使用した際の錬金アイテム特有の処理
   */
  protected abstract useAlchemyItem(ev: UseAlchemyItemEvent): void
}
