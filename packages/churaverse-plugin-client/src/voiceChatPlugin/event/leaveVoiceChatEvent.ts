import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ボイスチャットを終了した時に発火するイベント
 */
export class LeaveVoiceChatEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * ボイスチャットを終了したプレイヤーのid
     */
    public readonly playerId: string
  ) {
    super('leaveVoiceChat', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    leaveVoiceChat: LeaveVoiceChatEvent
  }
}
