import { domLayerSetting, DomManager } from 'churaverse-engine-client'
import style from './MeetingButtonComponent.module.scss'

const PORTAL_TO_MEETING_KEY = 'portalToMeeting'

export class MeetingButton {
  public constructor() {
    const btn = document.createElement('button')
    btn.textContent = 'ゲームモードOFF'
    btn.className = style.meetingButton

    btn.addEventListener('click', () => {
      sessionStorage.setItem(PORTAL_TO_MEETING_KEY, 'true')
      window.location.href = '/'
    })

    domLayerSetting(btn, 'higher')
    DomManager.addDom(btn)
  }
}
