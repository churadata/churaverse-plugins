import { JSXFunc } from 'churaverse-engine-client'
import style from './RuleExplanationWindowComponent.module.scss'
export const POPUP_GAME_START_WINDOW_BUTTON_ID = 'gameStartForm-open-button'
export const GAME_START_BUTTON = 'game-start-button'

export const RuleExplanationWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container} id={POPUP_GAME_START_WINDOW_BUTTON_ID}>
      <ol>
        <li>
          下記の「シンクロブレイク開始」ボタンを押すと、現在ワールド内にいるプレイヤーを参加者としてゲームが開始されます。ゲームを開始したプレイヤーは「管理者」になります。
        </li>
        <br />
        <li>ゲーム開始後、各プレイヤーにはコインが100枚ずつ配られます。</li>
        <br />
        <li>管理者が、ターン数と制限時間数を入力します。</li>
        <br />
        <li>
          各プレイヤーは、保有コイン内でベット数を選択します。全員がベット数を入力すると、自動でゲームが開始されます。
        </li>
        <br />
        <li>制限時間内に、各プレイヤーは一回ニョッキボタンを押します。</li>
        <br />
        <li>
          ニョッキボタンを押した順番によって各プレイヤーの倍率が決まり、1ターン毎に「ベット数×倍率」のコインが各プレイヤーに返ってきます。早くニョッキした人ほど倍率は高くなります。しかし、他のプレイヤーと同じタイミングで押してしまうと倍率は0になり、そのターンのベットコインは全て消えてしまいます。
        </li>
        <br />
        <li>全ターン終了後、最終的な保有コイン数によってランキングが決まります。</li>
      </ol>
      <button className={style.popupButton} type="button" id={GAME_START_BUTTON}>
        シンクロブレイク開始
      </button>
    </div>
  )
}
