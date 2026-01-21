import { JSXFunc } from 'churaverse-engine-client'
import style from './DescriptionWindowComponent.module.scss'
import { CHURAREN_GAME_START_BUTTON_ID } from '../descriptionWindow'

interface DescriptionWindowProps {
  description: string
}

export const CHURAREN_DESCRIPTION =
  'ちゅられんは、みんなで協力し、制限時間内に強大なモンスターに立ち向かう協力型バトルゲーム！ フィールドでアイテムを集め、錬金窯で攻撃を錬金し、チームでボスモンスターを撃破しよう！'

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
