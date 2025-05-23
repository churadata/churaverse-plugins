import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ExplosionBombData extends SendableObject {
  bombId: string
}

export class BombExplosionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionBombData) {
    super('bombExplosion', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    bombExplosion: BombExplosionMessage
  }
}
