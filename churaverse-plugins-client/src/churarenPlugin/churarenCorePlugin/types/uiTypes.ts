/**
 * UIの種類
 *
 * ---
 * UpdateChurarenUiType = ChurarenUiState | ChurarenGameResult
 *
 * ---
 *
 * プレイ画面の種類（ChurarenUiState）
 *
 * |||
 * |---|---|
 * |statCount|スタートカウント|
 * |countTimer||
 *
 * ---
 *
 * 結果画面の種類（ChurarenGameResult）
 *
 * |||
 * |---|---|
 * |timeOver|時間切れ|
 * |win|ボスを倒した時|
 * |gameOver|プレイヤーが全滅した時|
 *
 */
export type UpdateChurarenUiType = ChurarenUiState | ChurarenGameResult
export type ChurarenUiState = 'startCount' | 'countTimer'
export type ChurarenGameResult = 'timeOver' | 'win' | 'gameOver'

/**
 * プレイ画面の種類かどうか
 */
export function isChurarenUiState(uiType: UpdateChurarenUiType): uiType is ChurarenUiState {
  return uiType === 'startCount' || uiType === 'countTimer'
}

/**
 * 結果画面の種類かどうか
 */
export function isChurarenGameResult(uiType: UpdateChurarenUiType): uiType is ChurarenGameResult {
  return uiType === 'timeOver' || uiType === 'win' || uiType === 'gameOver'
}
