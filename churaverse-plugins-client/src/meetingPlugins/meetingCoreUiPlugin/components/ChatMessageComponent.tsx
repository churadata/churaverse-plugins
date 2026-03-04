import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'

interface Props {
  senderId: string
  text: string
  isSelf: boolean
}

export const ChatMessageComponent: JSXFunc<Props> = ({ senderId, text, isSelf }: Props) => {
  const label = isSelf ? `${senderId} (自分)` : senderId
  return (
    <div className={style.chatMessage}>
      <span className={style.chatAuthor}>{label}</span>
      <span className={style.chatText}>{text}</span>
    </div>
  )
}
