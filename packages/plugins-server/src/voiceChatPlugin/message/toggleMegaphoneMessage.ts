import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface ToggleMegaphoneData extends SendableObject {
  playerId: string
  active: boolean
}

export class ToggleMegaphoneMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ToggleMegaphoneData) {
    super('toggleMegaphone', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    toggleMegaphone: ToggleMegaphoneMessage
  }
}
