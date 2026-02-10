import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'

const DUMMY_PARTICIPANTS = [
  { id: 1, name: 'User 1', isMuted: false },
  { id: 2, name: 'User 2', isMuted: true },
  { id: 3, name: 'User 3', isMuted: true },
  { id: 4, name: 'User 4', isMuted: false },
  { id: 5, name: 'User 5', isMuted: true },
  { id: 6, name: 'User 6', isMuted: false },
  { id: 7, name: 'You', isMuted: false },
]

const DUMMY_MESSAGES = [
  { id: 1, author: 'User 1', text: 'こんにちは' },
  { id: 2, author: 'User 2', text: '会議を始めましょう' },
]

export const MeetingSidebarComponent: JSXFunc = () => {
  return (
    <div className={style.sidebar} id="meeting-sidebar" data-visible="false" data-tab="participants">
      {/* 参加者一覧 */}
      <div className={style.section} id="participants-section" data-active="true">
        <div className={style.sectionHeader}>
          <span className={style.sectionTitle}>参加者 ({DUMMY_PARTICIPANTS.length})</span>
          <button className={style.closeButton} id="sidebar-close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div className={style.participantList}>
          {DUMMY_PARTICIPANTS.map((p) => (
            <div key={p.id} className={style.participantItem}>
              <div className={style.participantAvatar}>{p.name[0]}</div>
              <span className={style.participantName}>{p.name}</span>
              {p.isMuted && (
                <svg className={style.mutedIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* チャット */}
      <div className={style.section} id="chat-section" data-active="false">
        <div className={style.sectionHeader}>
          <span className={style.sectionTitle}>チャット</span>
          <button className={style.closeButton} id="sidebar-close-button-chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div className={style.chatMessages} id="chat-messages">
          {DUMMY_MESSAGES.map((m) => (
            <div key={m.id} className={style.chatMessage}>
              <span className={style.chatAuthor}>{m.author}</span>
              <span className={style.chatText}>{m.text}</span>
            </div>
          ))}
        </div>
        <div className={style.chatInputArea}>
          <input
            type="text"
            className={style.chatInput}
            id="chat-input"
            placeholder="メッセージを入力..."
          />
          <button className={style.chatSendButton} id="chat-send-button">
            送信
          </button>
        </div>
      </div>
    </div>
  )
}
