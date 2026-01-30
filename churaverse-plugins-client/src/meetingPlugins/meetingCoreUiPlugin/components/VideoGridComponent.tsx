import { JSXFunc } from 'churaverse-engine-client'
import style from './VideoGridComponent.module.scss'

// スタイルのエクスポート（MeetingWebRtcPluginで使用）
export { style as videoGridStyles }

export const VideoGridComponent: JSXFunc = () => {
  return (
    <div className={style.videoGridContainer}>
      <div id="video-grid" className={`${style.videoGrid} ${style.grid1}`}>
        {/* MeetingWebRtcPluginが動的にタイルを追加 */}
      </div>
    </div>
  )
}
