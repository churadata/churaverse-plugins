export interface IGameDescriptionDialog {
  open: (state: GameDescriptionDialogType) => void
  close: () => void
}

/**
 * ゲーム詳細ダイアログの状態
 * - viewOnly: 閉じるボタンのみ表示
 * - joinable: 参加・不参加ボタンを表示
 */
export type GameDescriptionDialogType = 'viewOnly' | 'joinable'
