import { JSXFunc } from 'churaverse-engine-client'
import style from './ChatComponent.module.scss'

export const ChatComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>チャット</div>
      <div className={style.messages} id="chat-messages">
        <div className={style.message}>
          <span className={style.messageAuthor}>ユーザー1:</span>
          <span className={style.messageText}>こんにちは</span>
        </div>
        <div className={style.message}>
          <span className={style.messageAuthor}>ユーザー2:</span>
          <span className={style.messageText}>会議を始めましょう</span>
        </div>
      </div>
      <div className={style.inputContainer}>
        <input type="text" className={style.input} id="chat-input" placeholder="メッセージを入力..." />
        <button className={style.sendButton} id="chat-send-button">
          送信
        </button>
      </div>
    </div>
  )
}
