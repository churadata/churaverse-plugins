import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム参加者のプレイヤーidリストを通知するイベント
 * @param participantIds ゲームに参加するプレイヤーid
 */
export class GameParticipantEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly participantIds: string[]
  ) {
    super('gameParticipant', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameParticipant: GameParticipantEvent
  }
}
