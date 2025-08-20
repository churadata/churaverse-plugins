import { IMainScene, Store, DomManager } from 'churaverse-engine-client'
import { RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { PopupChurarenRule } from './popupChurarenRule'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'

/**
 * ゲームリストにちゅられんを追加するクラス
 */
export class ChurarenDialogManager {
  private readonly gamePluginStore: GamePluginStore
  private readonly popupChurarenRule: PopupChurarenRule
  public constructor(store: Store<IMainScene>) {
    const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
    this.gamePluginStore = store.of('gamePlugin')
    this.popupChurarenRule = new PopupChurarenRule(store)
    this.popupChurarenRule.createGameDescription(explanation)
    this.gamePluginStore.gameDescriptionDialogManager.add(CHURAREN_CONSTANTS.GAME_ID, this.popupChurarenRule)
  }
}
