import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ボイスチャットを開始した時に発火するイベント
 */
export class JoinVoiceChatEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * ボイスチャットを開始したプレイヤーのid
     */
    public readonly playerId: string,
    /**
     * ボイスチャットの音声データ
     */
    public readonly voice: HTMLMediaElement
  ) {
    super('joinVoiceChat', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    joinVoiceChat: JoinVoiceChatEvent
  }
}
