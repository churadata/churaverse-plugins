import { JSXFunc } from 'churaverse-engine-client'
import style from './VideoGridComponent.module.scss'

export { style as videoGridStyles }

export const VIDEO_GRID_ID = 'video-grid'

export const VideoGridComponent: JSXFunc = () => {
  return (
    <div className={style.videoGridContainer}>
      <div id={VIDEO_GRID_ID} className={`${style.videoGrid} ${style.grid1}`}></div>
    </div>
  )
}
