import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface BossWalkData extends SendableObject {
  startPos: Vector & Sendable
  dest: Vector & Sendable
  direction: Direction
  speed: number
  bossId: string
}

export class BossWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossWalkData) {
    super('bossWalk', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    bossWalk: BossWalkMessage
  }
}
