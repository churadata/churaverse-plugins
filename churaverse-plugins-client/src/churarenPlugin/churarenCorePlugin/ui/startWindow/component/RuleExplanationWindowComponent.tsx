import { JSXFunc } from 'churaverse-engine-client'
import style from './RuleExplanationWindowComponent.module.scss'
import headerImage from '../../../assets/ruleDescriptionImages/header.png'
import itemImage from '../../../assets/ruleDescriptionImages/item_with_player.png'
import alchemyImage from '../../../assets/ruleDescriptionImages/items_with_alchemy.png'
import bossImage from '../../../assets/ruleDescriptionImages/attack_to_boss.png'
import ghostImage from '../../../assets/ruleDescriptionImages/ghost_player.png'

export const POPUP_GAME_START_WINDOW_BUTTON_ID = 'churaren-game-start-form-open-button'
export const GAME_START_BUTTON = 'churaren-game-start-button'

export const RuleExplanationWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div id={POPUP_GAME_START_WINDOW_BUTTON_ID}>
        <h2 className={style.title}>ちゅられん</h2>
        <p className={style.description}>
          ちゅられんは、みんなで協力し、制限時間内に強大なモンスターに立ち向かう協力型バトルゲーム！
        </p>

        <div className={style.section}>
          <img src={headerImage} alt="プレイ中の様子を写した画像" className={style.headerImage} />
        </div>

        <div className={style.section}>
          <h4>1. アイテムを集めよう！</h4>
          <p>ボス(※1)の攻撃を掻い潜りながら、フィールドに落ちている錬金アイテムを集めます。</p>
          <img src={itemImage} alt="アイテムとプレイヤーの写った画像" className={style.image} />
        </div>

        <div className={style.section}>
          <h4>2. 錬金窯で攻撃を錬金！</h4>
          <p>集めた錬金アイテムを錬金窯に投入すると、攻撃を錬金することができます。</p>
          <img src={alchemyImage} alt="錬金窯とアイテムを持ったプレイヤーの写った画像" className={style.image} />
        </div>

        <div className={style.section}>
          <h4>3. 錬金した攻撃でボスを撃破！</h4>
          <p>錬金した攻撃(※2)を使って、ボスモンスターにダメージを与えましょう！</p>
          <img src={bossImage} alt="錬金した攻撃とボスの写った画像" className={style.image} />
        </div>

        <div className={style.section}>
          <h3>ゴーストモード</h3>
          <p>
            ゲーム途中でボスの攻撃によってHPがゼロになってしまったプレイヤーは、ゴーストモード(※3)へ移行し、最後まで観戦することができます。
          </p>
          <img src={ghostImage} alt="ゴーストモードプレイヤーの写った画像" className={style.image} />
        </div>

        <div className={style.section}>
          <h4>勝利条件</h4>
          <ul style={{ listStylePosition: 'inside', paddingLeft: '0.5em' }}>
            <li>制限時間3分以内にボスモンスターのHPをゼロにする</li>
          </ul>

          <h4>敗北条件</h4>
          <ul style={{ listStylePosition: 'inside', paddingLeft: '0.5em' }}>
            <li>制限時間経過後にボスのHPが残っている</li>
            <li>参加プレイヤー全員がゴーストモードに移行した</li>
          </ul>
        </div>

        <div className={style.section}>
          <h5>補足</h5>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
            <li>(※1) 参加者が多いほど、それに応じてボスのHPも増加します</li>
            <li>(※2) 錬金に使うアイテムの組み合わせによって、攻撃の種類が変わります</li>
            <li>(※3) ゴーストモードでは攻撃・錬金などのアクションは無効になります</li>
          </ul>
        </div>
      </div>

      <br />

      <button className={style.popupButton} type="button" id={GAME_START_BUTTON}>
        ちゅられん開始
      </button>
    </div>
  )
}
