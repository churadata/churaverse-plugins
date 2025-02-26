import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム参加者のプレイヤーidリストを通知するイベント
 * @param participantIds ゲームに参加するプレイヤーid
 */
export class UpdateGameParticipantEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly participantIds: string[]
  ) {
    super('updateGameParticipant', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    updateGameParticipant: UpdateGameParticipantEvent
  }
}
