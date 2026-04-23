/**
 * TitleScene をリロード経由で再入場する際に、自動入場先のモード／
 * 表示名を引き継ぐための sessionStorage キー。
 */
export const PORTAL_STORAGE_KEYS = {
  TO_GAME_MODE: 'portalToGameMode',
  TO_MEETING: 'portalToMeeting',
  PLAYER_NAME: 'meetingPlayerName',
} as const
