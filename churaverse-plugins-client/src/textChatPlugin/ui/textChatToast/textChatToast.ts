import { DomManager, Store, IMainScene } from 'churaverse-engine-client' // Store, IMainSceneを追加
import { TextChat } from '../../model/textChat'
import { IToastRenderer } from '../interface/IToastRenderer'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer' // 追加
import { IBadgeHolder } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconHasBadge' // 追加
import { TextChatToastComponent } from './components/TextChatToastComponent'
import style from './components/TextChatToastComponent.module.scss'

export class TextChatToast implements IToastRenderer {
  private activeToasts: HTMLElement[] = []
  private container: HTMLDivElement

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
    if (this.activeToasts.length >= 3) {
      const oldest = this.activeToasts.shift()
      oldest?.remove()
    }

    const toastElement = DomManager.jsxToDom(TextChatToastComponent({ textChat, onClick: () => {} }))

    // ×ボタンを探して、クリックイベントをつける
    const closeButton = toastElement.querySelector(`.${style.closeButton}`)
    closeButton?.addEventListener('click', (event) => {
      // バブリングを止める
      event.stopPropagation()

      console.log('×ボタンが押されました。通知を削除します。')
      this.removeToast(toastElement)
    })

    // 本体クリック（ダイアログを開く）
    toastElement.addEventListener('click', () => {
      console.log('通知本体が押されました。ダイアログを開きます。')
      this.store.of('textChatPlugin').unreadCount = 0
      this.icon.activate()
      this.icon.badge.deactivate()
      this.switcher.open('chat', () => {})
      this.removeToast(toastElement)
    })

    this.container.prepend(toastElement)
    this.activeToasts.push(toastElement)

    setTimeout(() => {
      this.removeToast(toastElement)
    }, 3500)
  }

  private removeToast(element: HTMLElement): void {
    if (!element.isConnected) return
    element.classList.add(style.fadeOut)
    setTimeout(() => {
      element.remove()
      this.activeToasts = this.activeToasts.filter((t) => t !== element)
    }, 500)
  }
}
