import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'

// スタイルのエクスポート（MeetingWebRtcPluginで使用）
export { style as sidebarStyles }

export const MeetingSidebarComponent: JSXFunc = () => {
  return (
    <div className={style.sidebar} id="meeting-sidebar" data-visible="false" data-tab="participants">
      {/* 参加者一覧 */}
      <div className={style.section} id="participants-section" data-active="true">
        <div className={style.sectionHeader}>
          <span className={style.sectionTitle} id="participants-count">
            参加者 (0)
          </span>
          <button className={style.closeButton} id="sidebar-close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className={style.participantList} id="participant-list">
          {/* MeetingWebRtcPluginが動的に参加者を追加 */}
        </div>
      </div>

      {/* チャット */}
      <div className={style.section} id="chat-section" data-active="false">
        <div className={style.sectionHeader}>
          <span className={style.sectionTitle}>チャット</span>
          <button className={style.closeButton} id="sidebar-close-button-chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className={style.chatMessages} id="chat-messages">
          {/* チャット機能は後回し */}
        </div>
        <div className={style.chatInputArea}>
          <input type="text" className={style.chatInput} id="chat-input" placeholder="メッセージを入力..." />
          <button className={style.chatSendButton} id="chat-send-button">
            送信
          </button>
        </div>
      </div>
    </div>
  )
}
