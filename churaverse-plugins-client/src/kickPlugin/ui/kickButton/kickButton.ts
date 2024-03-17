import { IEventBus, DomManager, IMainScene } from 'churaverse-engine-client'
import { Player } from '../../../playerPlugin/domain/player'
import { RequestKickPlayerEvent } from '../../event/requestKickPlayerEvent'
import { KickButtonComponent } from './components/KickButtonComponent'

const KICK_ICON_PATH = 'src/game/plugins/coreUiPlugin/assets/exit.png'

export class KickButton {
  public readonly node: HTMLButtonElement

  public constructor(visible: boolean, ownPlayer: Player, kickPlayer: Player, eventBus: IEventBus<IMainScene>) {
    this.node = DomManager.jsxToDom(KickButtonComponent({ visible, iconPath: KICK_ICON_PATH })) as HTMLButtonElement

    this.node.onclick = () => {
      const isPlayerKicked = window.confirm(`「${kickPlayer.name}」 を退出させますか？`)
      if (isPlayerKicked) {
        eventBus.post(new RequestKickPlayerEvent(kickPlayer, ownPlayer))
      }
    }
  }
}
