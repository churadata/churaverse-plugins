import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface ExplosionBombData extends SendableObject {
  bombId: string
}

export class BombExplosionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionBombData) {
    super('bombExplosion', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    bombExplosion: BombExplosionMessage
  }
}
