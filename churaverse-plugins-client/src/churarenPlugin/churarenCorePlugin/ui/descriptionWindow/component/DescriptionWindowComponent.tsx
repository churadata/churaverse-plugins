import { JSXFunc } from 'churaverse-engine-client'
import style from './DescriptionWindowComponent.module.scss'
import { CHURAREN_GAME_START_BUTTON_ID } from '../descriptionWindow'

interface DescriptionWindowProps {
  description: string
}

export const DescriptionWindowComponent: JSXFunc<DescriptionWindowProps> = ({
  description,
}: DescriptionWindowProps) => {
  return (
    <div className={style.container}>
      <div className={style.textContainer}>{description}</div>
      <button className={style.button} type="button" id={CHURAREN_GAME_START_BUTTON_ID}>
        準備完了
      </button>
    </div>
  )
}
