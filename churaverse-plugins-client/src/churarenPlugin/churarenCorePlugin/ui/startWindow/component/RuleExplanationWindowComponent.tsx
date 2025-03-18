import { JSXFunc } from 'churaverse-engine-client'
import style from './RuleExplanationWindowComponent.module.scss'
export const POPUP_GAME_START_WINDOW_BUTTON_ID = 'churaren-game-start-form-open-button'
export const GAME_START_BUTTON = 'churaren-game-start-button'

export const RuleExplanationWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div id={POPUP_GAME_START_WINDOW_BUTTON_ID}>
        まず、プレイヤーはワールドに配置されたアイテムを集め、マップの四方八方に配置されている錬金スポットへ行こう。そこにいくと、アイテムを錬金でき、攻撃や回復といった効果を持つ新たなアイテムを作ることができるぞ。錬金したアイテムを使って、協力してボスを討伐しよう！！
      </div>
      <br />
      <button className={style.popupButton} type="button" id={GAME_START_BUTTON}>
        ちゅられん開始
      </button>
    </div>
  )
}
