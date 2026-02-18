import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'

export { style as sidebarStyles }

export const SIDEBAR_ID = 'meeting-sidebar'
export const PARTICIPANTS_SECTION_ID = 'participants-section'
export const CHAT_SECTION_ID = 'chat-section'
export const SIDEBAR_CLOSE_BUTTON_ID = 'sidebar-close-button'
export const SIDEBAR_CLOSE_BUTTON_CHAT_ID = 'sidebar-close-button-chat'
export const PARTICIPANTS_COUNT_ID = 'participants-count'
export const PARTICIPANT_LIST_ID = 'participant-list'
export const CHAT_MESSAGES_ID = 'chat-messages'
export const CHAT_INPUT_ID = 'chat-input'
export const CHAT_SEND_BUTTON_ID = 'chat-send-button'

export const MeetingSidebarComponent: JSXFunc = () => {
  return (
    <div className={style.sidebar} id={SIDEBAR_ID} data-visible="false" data-tab="participants">
      <div className={style.section} id={PARTICIPANTS_SECTION_ID} data-active="true">
        <div className={style.sectionHeader}>
          <span className={style.sectionTitle} id={PARTICIPANTS_COUNT_ID}>
            参加者 (0)
          </span>
          <button className={style.closeButton} id={SIDEBAR_CLOSE_BUTTON_ID}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className={style.participantList} id={PARTICIPANT_LIST_ID}></div>
      </div>

      <div className={style.section} id={CHAT_SECTION_ID} data-active="false">
        <div className={style.sectionHeader}>
          <span className={style.sectionTitle}>チャット</span>
          <button className={style.closeButton} id={SIDEBAR_CLOSE_BUTTON_CHAT_ID}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className={style.chatMessages} id={CHAT_MESSAGES_ID}></div>
        <div className={style.chatInputArea}>
          <input type="text" className={style.chatInput} id={CHAT_INPUT_ID} placeholder="メッセージを入力..." />
          <button className={style.chatSendButton} id={CHAT_SEND_BUTTON_ID}>
            送信
          </button>
        </div>
      </div>
    </div>
  )
}
