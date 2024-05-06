import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { Badge } from './badge'
import { ITextChatDialog } from '../interface/ITextChatDialog'

const CHAT_ICON_PATH = new URL(`../../../assets/chat.png`, import.meta.url).href

export class TextChatIcon extends TopBarIconRenderer {
  private readonly iconContainer: HTMLDivElement

  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: ITextChatDialog,
    iconContainer: ITopBarIconContainer,
    public readonly badge: Badge,
    iconPath: string = CHAT_ICON_PATH
  ) {
    super({
      activeIconImgPath: iconPath,
      inactiveIconImgPath: iconPath,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    this.iconContainer = document.createElement('div')
    this.iconContainer.style.position = 'relative'
    this.iconContainer.appendChild(super.node)

    badge.setBadgeOn(this.iconContainer)
    badge.moveTo(0, 0)

    iconContainer.addIcon(this)
    switcher.add('chat', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('chat', () => {
        super.activate()
        this.badge.deactivate()
      })
    }
  }

  public get node(): HTMLElement {
    return this.iconContainer
  }
}
