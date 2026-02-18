import { BasePlugin, IMeetingScene, StartEvent, DomManager } from 'churaverse-engine-client'
import { MeetingScreenComponent } from './components/MeetingScreenComponent'
import {
  SIDEBAR_ID,
  PARTICIPANTS_SECTION_ID,
  CHAT_SECTION_ID,
  SIDEBAR_CLOSE_BUTTON_ID,
  SIDEBAR_CLOSE_BUTTON_CHAT_ID,
} from './components/MeetingSidebarComponent'
import {
  PARTICIPANTS_TOGGLE_BUTTON_ID,
  CHAT_TOGGLE_BUTTON_ID,
} from './components/MeetingControlBarComponent'

export class MeetingCoreUiPlugin extends BasePlugin<IMeetingScene> {
  public listenEvent(): void {
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private start(ev: StartEvent): void {
    DomManager.addJsxDom(MeetingScreenComponent())
    this.initSidebarToggle()
  }

  private initSidebarToggle(): void {
    const sidebar = DomManager.getElementById(SIDEBAR_ID)
    const participantsSection = DomManager.getElementById(PARTICIPANTS_SECTION_ID)
    const chatSection = DomManager.getElementById(CHAT_SECTION_ID)
    const participantsButton = DomManager.getElementById(PARTICIPANTS_TOGGLE_BUTTON_ID)
    const chatButton = DomManager.getElementById(CHAT_TOGGLE_BUTTON_ID)
    const closeButton = DomManager.getElementById(SIDEBAR_CLOSE_BUTTON_ID)
    const closeButtonChat = DomManager.getElementById(SIDEBAR_CLOSE_BUTTON_CHAT_ID)

    const showSidebar = (tab: 'participants' | 'chat'): void => {
      const currentTab = sidebar.getAttribute('data-tab')
      const isVisible = sidebar.getAttribute('data-visible') === 'true'

      if (isVisible && currentTab === tab) {
        sidebar.setAttribute('data-visible', 'false')
      } else {
        sidebar.setAttribute('data-visible', 'true')
        sidebar.setAttribute('data-tab', tab)
        participantsSection.setAttribute('data-active', tab === 'participants' ? 'true' : 'false')
        chatSection.setAttribute('data-active', tab === 'chat' ? 'true' : 'false')
      }
    }

    const closeSidebar = (): void => {
      sidebar.setAttribute('data-visible', 'false')
    }

    participantsButton.addEventListener('click', () => { showSidebar('participants') })
    chatButton.addEventListener('click', () => { showSidebar('chat') })
    closeButton.addEventListener('click', () => { closeSidebar() })
    closeButtonChat.addEventListener('click', () => { closeSidebar() })
  }
}
