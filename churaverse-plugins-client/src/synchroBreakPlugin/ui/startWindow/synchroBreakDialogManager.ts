import { IMainScene, Store, DomManager } from 'churaverse-engine-client'
import { RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { PopupSynchroBreakRule } from './popupSynchroBreakRule'

/**
 * ゲームリストにシンクロブレイクを追加するクラス
 */
export class SynchroBreakDialogManager {
  private readonly gamePluginStore: GamePluginStore
  private readonly popupSynchroBreakRule: PopupSynchroBreakRule
  public constructor(store: Store<IMainScene>) {
    const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
    this.gamePluginStore = store.of('gamePlugin')
    this.popupSynchroBreakRule = new PopupSynchroBreakRule(store)
    this.popupSynchroBreakRule.createGameDescription(explanation)
    this.gamePluginStore.gameDescriptionDialogManager.add('synchroBreak', this.popupSynchroBreakRule)
  }
}
