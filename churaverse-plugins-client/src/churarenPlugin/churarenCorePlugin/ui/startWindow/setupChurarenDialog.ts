import { IMainScene, Store, DomManager } from 'churaverse-engine-client'
import { RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'
import { ChurarenDescriptionDialog } from './churarenDescriptionDialog'

/**
 * ゲームリストにちゅられんを追加する関数
 */
export function setupChurarenDialog(store: Store<IMainScene>): void {
  const popupChurarenRule = new ChurarenDescriptionDialog(store)
  const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
  popupChurarenRule.createGameDescription(explanation)
  store.of('gamePlugin').gameDescriptionDialogManager.add(CHURAREN_CONSTANTS.GAME_ID, popupChurarenRule)
}
