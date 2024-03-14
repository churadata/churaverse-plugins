import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface ToggleMicData extends SendableObject {
  playerId: string
  isUnmute: boolean
}

export class ToggleMicMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMicData) {
    super('toggleMic', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    toggleMic: ToggleMicMessage
  }
}
