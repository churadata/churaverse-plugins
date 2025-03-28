import { JSXFunc } from 'churaverse-engine-client'
import style from './RuleExplanationWindowComponent.module.scss'
import description1 from '../../../assets/description1.png'
import description2 from '../../../assets/description2.png'
import description3 from '../../../assets/description3.png'
export const POPUP_GAME_START_WINDOW_BUTTON_ID = 'gameStartForm-open-button'
export const GAME_START_BUTTON = 'game-start-button'

export const RuleExplanationWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container} id={POPUP_GAME_START_WINDOW_BUTTON_ID}>
      <p className={style.nyokkigameCaption}>
        タイミングを読んでニョッキし、
        <br />
        多くのコインを集めよう！💰
      </p>
      <ol>
        <li>下記の「シンクロブレイク開始」を押すと、ゲームが開始します。</li>
        <br />
        <li>ゲーム開始者が、ターン数と制限時間数を指定します。</li>
        <br />
        <li>全プレイヤーがベットコイン数を入力すると、ニョッキゲームが開始します。</li>
        <br />
        <li>ニョッキ順とベットコイン数によって、コインがreturnします。</li>
      </ol>
      <p className={style.nyokkigameIntro}>🍄ニョッキゲームルール🍄</p>
      <ol>
        <li>制限時間内に、各プレイヤーは一度だけニョッキボタンを押します。</li>
        <img src={description1} style={{ width: '200px', height: '80px' }}></img>
        <br />
        <li>他のプレイヤーと同時にニョッキボタンを押すor時間内に押さなかった場合は、失敗となります。</li>
        <img src={description2} style={{ width: '200px', height: '150px' }}></img>
        <br />
        <li>ニョッキ成功したプレイヤーの中で、ニョッキボタンを早く押した人から順に順位が決まります。</li>
        <img src={description3} style={{ width: '200px', height: '110px' }}></img>
        <br />
        <li>
          順位の高い順に高い倍率が付与され、「ベットコイン×倍率」がreturnします。
          <br />
          ※ニョッキに失敗した場合は倍率が0となり、ベットコインは戻りません。
        </li>
      </ol>
      <button className={style.popupButton} type="button" id={GAME_START_BUTTON}>
        シンクロブレイク開始
      </button>
    </div>
  )
}
