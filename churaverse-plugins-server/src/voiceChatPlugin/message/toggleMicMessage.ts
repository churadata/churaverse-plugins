import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface ToggleMicData extends SendableObject {
  playerId: string
  isUnmute: boolean
}

export class ToggleMicMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMicData) {
    super('toggleMic', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    toggleMic: ToggleMicMessage
  }
}
