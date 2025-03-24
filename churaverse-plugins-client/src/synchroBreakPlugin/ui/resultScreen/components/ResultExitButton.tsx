import { JSXFunc } from 'churaverse-engine-client'
import style from './ResultExitButton.module.scss'

/**
 * 結果画面の退出ボタン
 */
export const ResultExitButton: JSXFunc = () => {
  return <button className={style.resultExitButton}>閉じる</button>
}
