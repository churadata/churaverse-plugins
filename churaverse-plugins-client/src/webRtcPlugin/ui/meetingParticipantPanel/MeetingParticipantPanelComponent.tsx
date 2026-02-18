import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingParticipantPanelComponent.module.scss'

export { style as meetingParticipantPanelStyles }

export const PANEL_ID = 'meeting-participant-panel'
export const PANEL_HEADER_ID = 'meeting-participant-panel-header'
export const PANEL_TOGGLE_ID = 'meeting-participant-panel-toggle'
export const PANEL_COUNT_ID = 'meeting-participant-panel-count'
export const PANEL_LIST_ID = 'meeting-participant-panel-list'

export const MeetingParticipantPanelComponent: JSXFunc = () => {
  return (
    <div className={style.panel} id={PANEL_ID}>
      <div className={style.header} id={PANEL_HEADER_ID}>
        <span className={style.headerTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={style.headerIcon}>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span id={PANEL_COUNT_ID}>会議参加者 (0)</span>
        </span>
        <button className={style.toggleButton} id={PANEL_TOGGLE_ID}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
      </div>
      <div className={style.list} id={PANEL_LIST_ID}></div>
    </div>
  )
}
