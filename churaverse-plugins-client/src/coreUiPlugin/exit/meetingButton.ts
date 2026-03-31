import { domLayerSetting, DomManager } from 'churaverse-engine-client'

/**
 * ゲームモードから会議モードへ遷移するためのボタン
 */
export class MeetingButton {
  public constructor() {
    const btn = document.createElement('button')
    btn.textContent = 'ゲームモードOFF'
    btn.style.position = 'absolute'
    btn.style.top = '50px'
    btn.style.left = '110px'
    btn.style.padding = '6px 12px'
    btn.style.border = 'none'
    btn.style.borderRadius = '6px'
    btn.style.backgroundColor = 'rgba(18, 146, 226, 0.7)'
    btn.style.color = 'white'
    btn.style.fontSize = '13px'
    btn.style.fontWeight = '600'
    btn.style.cursor = 'pointer'
    btn.style.opacity = '0.8'

    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '1'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '0.8'
    })

    btn.addEventListener('click', () => {
      this.onClick()
    })

    domLayerSetting(btn, 'higher')
    DomManager.addDom(btn)
  }

  private onClick(): void {
    sessionStorage.setItem('portalToMeeting', 'true')
    window.location.href = '/'
  }
}
