import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'

interface Props {
  senderLabel: string
  text: string
  isSelf: boolean
}

export const ChatMessageComponent: JSXFunc<Props> = ({ senderLabel, text, isSelf }: Props) => {
  const label = isSelf ? `${senderLabel} (自分)` : senderLabel
  return (
    <div className={style.chatMessage}>
      <span className={style.chatAuthor}>{label}</span>
      <span className={style.chatText}>{text}</span>
    </div>
  )
}
