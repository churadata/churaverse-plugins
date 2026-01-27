import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingScreenComponent.module.scss'
import { VideoGridComponent } from './VideoGridComponent'
import { MeetingControlBarComponent } from './MeetingControlBarComponent'
import { MeetingSidebarComponent } from './MeetingSidebarComponent'

export const MeetingScreenComponent: JSXFunc = () => {
  return (
    <div className={style.meetingScreen} id="meeting-screen">
      <div className={style.mainArea}>
        <VideoGridComponent />
        <MeetingSidebarComponent />
      </div>
      <MeetingControlBarComponent />
    </div>
  )
}
