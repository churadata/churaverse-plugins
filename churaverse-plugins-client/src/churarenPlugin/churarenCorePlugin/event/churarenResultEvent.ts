import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { ChurarenGameResultType } from '../types/uiTypes'

export class ChurarenResultEvent extends CVEvent<IMainScene> {
  public constructor(public readonly resultType: ChurarenGameResultType) {
    super('churarenResult', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    churarenResult: ChurarenResultEvent
  }
}
