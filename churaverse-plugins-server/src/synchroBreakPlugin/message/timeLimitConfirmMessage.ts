import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface TimeLimitConfirmData extends SendableObject {
  playerId: string
  timeLimit: string
}

/**
 * タイムリミットが設定された際のメッセージ
 */
export class TimeLimitConfirmMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TimeLimitConfirmData) {
    super('timeLimitConfirm', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    timeLimitConfirm: TimeLimitConfirmMessage
  }
}
