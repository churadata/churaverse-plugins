import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ToggleMegaphoneData extends SendableObject {
  playerId: string
  active: boolean
}

export class ToggleMegaphoneMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMegaphoneData) {
    super('toggleMegaphone', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    toggleMegaphone: ToggleMegaphoneMessage
  }
}
