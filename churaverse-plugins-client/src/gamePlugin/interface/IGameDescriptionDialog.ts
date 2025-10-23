export interface IGameDescriptionDialog {
  open: (state: GameDescriptionDialogState) => void
  close: () => void
}

/**
 * ゲーム詳細ダイアログの状態
 * - showCloseButton: 閉じるボタンのみ表示
 * - showParticipationButtons: 参加・退出ボタンを表示
 */
export type GameDescriptionDialogState = 'showCloseButton' | 'showParticipationButtons'
