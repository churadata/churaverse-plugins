import { IMainScene, Store, DomManager } from 'churaverse-engine-client'
import { RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'
import { PopupChurarenRule } from './popupChurarenRule'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'

/**
 * ゲームリストにちゅられんを追加する関数
 */
export function setupChurarenDialog(store: Store<IMainScene>): void {
  const popupChurarenRule = new PopupChurarenRule(store)
  const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
  popupChurarenRule.createGameDescription(explanation)
  store.of('gamePlugin').gameDescriptionDialogManager.add(CHURAREN_CONSTANTS.GAME_ID, popupChurarenRule)
}
