import { JSXFunc } from 'churaverse-engine-client'
import { TextChat } from '../../../model/textChat'
import style from './TextChatToastComponent.module.scss'

interface TextChatToastProps {
  textChat: TextChat
  onClick: () => void
}

export const TextChatToastComponent: JSXFunc<TextChatToastProps> = ({ textChat, onClick }) => {
  return (
    <div className={style.toastContainer}>
      <span className={style.closeButton}>×</span>

      <div className={style.senderName}>{textChat.name}</div>
      <div className={style.message}>{textChat.message}</div>
    </div>
  )
}
