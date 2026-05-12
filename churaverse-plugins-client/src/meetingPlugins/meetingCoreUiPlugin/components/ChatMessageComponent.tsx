import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'

interface Props {
  senderLabel: string
  text: string
  isOwn: boolean
}

export const ChatMessageComponent: JSXFunc<Props> = ({ senderLabel, text, isOwn }: Props) => {
  const label = isOwn ? `${senderLabel} (自分)` : senderLabel
  return (
    <div className={style.chatMessage}>
      <span className={style.chatAuthor}>{label}</span>
      <span className={style.chatText}>{text}</span>
    </div>
  )
}
