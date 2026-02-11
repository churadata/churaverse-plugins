import {
  BasePlugin,
  IMeetingScene,
  PhaserSceneInit,
  StartEvent,
  DomManager,
} from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { MeetingScreenComponent } from './components/MeetingScreenComponent'

export class MeetingCoreUiPlugin extends BasePlugin<IMeetingScene> {
  private scene?: Scene

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private start(ev: StartEvent): void {
    DomManager.addJsxDom(MeetingScreenComponent())
    this.initSidebarToggle()
  }

  private initSidebarToggle(): void {
    const sidebar = document.getElementById('meeting-sidebar')
    const participantsSection = document.getElementById('participants-section')
    const chatSection = document.getElementById('chat-section')
    const participantsButton = document.getElementById('participants-toggle-button')
    const chatButton = document.getElementById('chat-toggle-button')
    const closeButton = document.getElementById('sidebar-close-button')
    const closeButtonChat = document.getElementById('sidebar-close-button-chat')

    const showSidebar = (tab: 'participants' | 'chat'): void => {
      if (sidebar == null) return
      const currentTab = sidebar.getAttribute('data-tab')
      const isVisible = sidebar.getAttribute('data-visible') === 'true'

      if (isVisible && currentTab === tab) {
        sidebar.setAttribute('data-visible', 'false')
      } else {
        sidebar.setAttribute('data-visible', 'true')
        sidebar.setAttribute('data-tab', tab)

        if (participantsSection != null && chatSection != null) {
          participantsSection.setAttribute('data-active', tab === 'participants' ? 'true' : 'false')
          chatSection.setAttribute('data-active', tab === 'chat' ? 'true' : 'false')
        }
      }
    }

    const closeSidebar = (): void => {
      if (sidebar == null) return
      sidebar.setAttribute('data-visible', 'false')
    }

    participantsButton?.addEventListener('click', () => { showSidebar('participants') })
    chatButton?.addEventListener('click', () => { showSidebar('chat') })
    closeButton?.addEventListener('click', () => { closeSidebar() })
    closeButtonChat?.addEventListener('click', () => { closeSidebar() })
  }
}
