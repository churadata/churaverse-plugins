import { domLayerSetting, DomManager } from 'churaverse-engine-client'
import { PORTAL_STORAGE_KEYS } from '@churaverse/transition-plugin-client'
import style from './MeetingButtonComponent.module.scss'

export class MeetingButton {
  public constructor() {
    const btn = document.createElement('button')
    btn.textContent = 'ゲームモードOFF'
    btn.className = style.meetingButton

    btn.addEventListener('click', () => {
      sessionStorage.setItem(PORTAL_STORAGE_KEYS.TO_MEETING, 'true')
      window.location.href = '/'
    })

    domLayerSetting(btn, 'higher')
    DomManager.addDom(btn)
  }
}
