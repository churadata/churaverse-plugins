import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface ExplosionBombData extends SendableObject {
  bombId: string
}

export class BombExplosionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionBombData) {
    super('bombExplosion', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bombExplosion: BombExplosionMessage
  }
}
