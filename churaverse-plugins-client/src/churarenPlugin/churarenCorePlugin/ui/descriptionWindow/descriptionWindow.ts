import { DomManager, IMainScene, Store, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client/gameUiManager'
import { CHURAREN_DESCRIPTION } from '../startWindow/component/RuleExplanationWindowComponent'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { ChurarenPlayerReadyMessage } from '../../message/churarenPlayerReadyMessage'
import { IDescriptionWindow } from '../../interface/IChurarenUiComponent'

export const CHURAREN_GAME_START_BUTTON_ID = 'churaren-send-ready-button'

export class DescriptionWindow implements IDescriptionWindow {
  public element!: HTMLElement
  public visible: boolean = true
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly playerId: string
  ) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: CHURAREN_DESCRIPTION }))
    domLayerSetting(this.element, 'lowest')
    this.setSendReadyButton(this.playerId)
  }

  public remove(): void {
    this.element.parentNode?.removeChild(this.element)
  }

  private setSendReadyButton(playerId: string): void {
    const sendReadyButton = DomManager.getElementById(CHURAREN_GAME_START_BUTTON_ID)
    sendReadyButton.onclick = () => {
      this.element.style.display = 'none'
      const sendChurarenReadyMessage = new ChurarenPlayerReadyMessage({ playerId })
      this.networkPluginStore.messageSender.send(sendChurarenReadyMessage)
    }
  }

  public hideDescription(): void {
    this.element.style.display = 'none'
  }
}
