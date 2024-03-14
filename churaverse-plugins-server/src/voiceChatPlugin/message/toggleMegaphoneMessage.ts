import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface ToggleMegaphoneData extends SendableObject {
  playerId: string
  active: boolean
}

export class ToggleMegaphoneMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMegaphoneData) {
    super('toggleMegaphone', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    toggleMegaphone: ToggleMegaphoneMessage
  }
}
