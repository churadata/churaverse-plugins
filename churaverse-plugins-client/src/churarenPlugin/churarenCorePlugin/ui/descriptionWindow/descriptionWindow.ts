import { DomManager, IMainScene, Store, domLayerSetting } from 'churaverse-engine-client'
import { CHURAREN_GAME_START_BUTTON_ID, DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client/gameUiManager'
import { CHURAREN_DESCRIPTION } from '../startWindow/component/RuleExplanationWindowComponent'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { ChurarenPlayerReadyMessage } from '../../message/churarenPlayerReadyMessage'
import { IDescriptionWindow } from '../../interface/IChurarenUiComponent'

export class DescriptionWindow implements IDescriptionWindow {
  public element!: HTMLElement
  public visible: boolean = true
  private descriptionText: string = CHURAREN_DESCRIPTION
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly playerId: string
  ) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    domLayerSetting(this.element, 'lowest')
    this.setSendReadyButton(this.playerId)
  }

  public remove(): void {
    this.descriptionText = ''
    this.element.parentNode?.removeChild(this.element)
  }

  /**
   * 説明ウィンドウの文章を更新する
   * @param text 更新する文章
   */
  public setDescriptionText(text: string): void {
    this.element.innerHTML = text
  }

  private setSendReadyButton(playerId: string): void {
    const sendReadyButton = DomManager.getElementById(CHURAREN_GAME_START_BUTTON_ID)
    sendReadyButton.onclick = () => {
      this.element.style.display = 'none'
      const sendChurarenReadyMessage = new ChurarenPlayerReadyMessage({ playerId })
      this.networkPluginStore.messageSender.send(sendChurarenReadyMessage)
    }
  }
}
