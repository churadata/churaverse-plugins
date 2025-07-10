import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface GhostModeData extends SendableObject {
  playerId: string
}

export class GhostModeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GhostModeData) {
    super('ghostMode', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    ghostMode: GhostModeMessage
  }
}
