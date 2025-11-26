import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface UseHealingPotionData extends SendableObject {
  playerId: string
  healAmount: number
}

export class UseHealingPotionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UseHealingPotionData) {
    super('useHealingPotion', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    useHealingPotion: UseHealingPotionMessage
  }
}
