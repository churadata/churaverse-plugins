import { JSXFunc } from 'churaverse-engine-client'
import style from './VideoGridComponent.module.scss'

export { style as videoGridStyles }

export const VideoGridComponent: JSXFunc = () => {
  return (
    <div className={style.videoGridContainer}>
      <div id="video-grid" className={`${style.videoGrid} ${style.grid1}`}></div>
    </div>
  )
}
