import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface BossWalkData extends SendableObject {
  startPos: Vector & SendableObject
  dest: Vector & SendableObject
  direction: Direction
  speed: number
  bossId: string
}

export class BossWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossWalkData) {
    super('bossWalk', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bossWalk: BossWalkMessage
  }
}
