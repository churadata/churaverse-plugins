import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingControlBarComponent.module.scss'
import micOnIcon from '../assets/microphone.png'
import micOffIcon from '../assets/microphone_off.png'
import cameraOnIcon from '../assets/video.png'
import cameraOffIcon from '../assets/video_off.png'
import screenShareOnIcon from '../assets/screenshare.png'
import screenShareOffIcon from '../assets/screenshare_off.png'
import exitIcon from '../assets/exit.png'
import peopleIcon from '../assets/people.png'
import chatIcon from '../assets/chat.png'

export { style as controlBarStyles }

export const MIC_TOGGLE_BUTTON_ID = 'mic-toggle-button'
export const CAMERA_TOGGLE_BUTTON_ID = 'camera-toggle-button'
export const SCREEN_SHARE_BUTTON_ID = 'screen-share-button'
export const MEETING_EXIT_BUTTON_ID = 'meeting-exit-button'
export const PARTICIPANTS_TOGGLE_BUTTON_ID = 'participants-toggle-button'
export const CHAT_TOGGLE_BUTTON_ID = 'chat-toggle-button'

export const MeetingControlBarComponent: JSXFunc = () => {
  return (
    <div className={style.controlBar}>
      <div className={style.centerSection}>
        <button
          className={`defaultStyle ${style.controlButton} ${style.activeButton}`}
          id={MIC_TOGGLE_BUTTON_ID}
          title="マイク"
        >
          <img src={micOnIcon} className={style.iconWhenDefault} alt="マイクON" />
          <img src={micOffIcon} className={style.iconWhenActive} alt="マイクOFF" />
        </button>

        <button
          className={`defaultStyle ${style.controlButton} ${style.activeButton}`}
          id={CAMERA_TOGGLE_BUTTON_ID}
          title="カメラ"
        >
          <img src={cameraOnIcon} className={style.iconWhenDefault} alt="カメラON" />
          <img src={cameraOffIcon} className={style.iconWhenActive} alt="カメラOFF" />
        </button>

        <button className={`defaultStyle ${style.controlButton}`} id={SCREEN_SHARE_BUTTON_ID} title="画面共有">
          <img src={screenShareOffIcon} className={style.iconWhenDefault} alt="画面共有OFF" />
          <img src={screenShareOnIcon} className={style.iconWhenActive} alt="画面共有ON" />
        </button>

        <button
          className={`defaultStyle ${style.controlButton} ${style.exitButton}`}
          id={MEETING_EXIT_BUTTON_ID}
          title="退出"
        >
          <img src={exitIcon} className={style.icon} alt="退出" />
        </button>
      </div>

      <div className={style.rightSection}>
        <button className={`defaultStyle ${style.sidebarButton}`} id={PARTICIPANTS_TOGGLE_BUTTON_ID} title="参加者">
          <img src={peopleIcon} className={style.icon} alt="参加者" />
        </button>

        <button className={`defaultStyle ${style.sidebarButton}`} id={CHAT_TOGGLE_BUTTON_ID} title="チャット">
          <img src={chatIcon} className={style.icon} alt="チャット" />
        </button>
      </div>
    </div>
  )
}
