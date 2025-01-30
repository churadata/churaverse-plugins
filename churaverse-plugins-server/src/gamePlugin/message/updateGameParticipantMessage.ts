import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface UpdateGameParticipantData extends SendableObject {
  gameId: GameIds
  participantIds: string[]
}

/**
 * ゲーム参加者のプレイヤーidリストを通知するメッセージ
 */
export class UpdateGameParticipantMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UpdateGameParticipantData) {
    super('updateGameParticipant', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    updateGameParticipant: UpdateGameParticipantMessage
  }
}
