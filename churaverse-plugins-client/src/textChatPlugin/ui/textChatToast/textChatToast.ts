import { DomManager, Store, IMainScene } from 'churaverse-engine-client' // Store, IMainSceneを追加
import { TextChat } from '../../model/textChat'
import { IToastRenderer } from '../interface/IToastRenderer'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer' // 追加
import { IBadgeHolder } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconHasBadge' // 追加
import { TextChatToastComponent } from './components/TextChatToastComponent'
import style from './components/TextChatToastComponent.module.scss'

const MAX_TOAST_COUNT = 3
const TOAST_DISPLAY_DURATION = 3500
const FADE_OUT_DURATION = 500

export class TextChatToast implements IToastRenderer {
  private activeToasts: HTMLElement[] = []
  private readonly container: HTMLDivElement

  // コンストラクタに store と icon を追加
  public constructor(
    private readonly switcher: IDialogSwitcher,
    private readonly store: Store<IMainScene>,
    private readonly icon: ITopBarIconRenderer & IBadgeHolder
  ) {
    this.container = document.createElement('div')
    this.container.className = style.toastListContainer
    document.body.appendChild(this.container)
  }

  public show(textChat: TextChat): void {
    if (this.activeToasts.length >= MAX_TOAST_COUNT) {
      const oldest = this.activeToasts.shift()
      oldest?.remove()
    }

    const toastElement = DomManager.jsxToDom(TextChatToastComponent({ textChat }))

    this.container.prepend(toastElement)
    this.activeToasts.push(toastElement)

    const closeButtonId = `toast-close-${textChat.playerId}`
    const closeButton = DomManager.getElementById(closeButtonId)

    closeButton?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.removeToast(toastElement)
    })

    // 本体クリック（ダイアログを開く）
    toastElement.addEventListener('click', () => {
      this.removeToast(toastElement)
      this.switcher.open('chat', () => {
        this.icon.activate()
        this.icon.badge.deactivate()
      })
    })

    setTimeout(() => {
      this.removeToast(toastElement)
    }, TOAST_DISPLAY_DURATION)
  }

  private removeToast(element: HTMLElement): void {
    if (!element.isConnected) return
    element.classList.add(style.fadeOut)
    setTimeout(() => {
      element.remove()
      this.activeToasts = this.activeToasts.filter((t) => t !== element)
    }, FADE_OUT_DURATION)
  }
}
