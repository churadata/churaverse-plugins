import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { InitUiData } from '../message/sendInitUiDataMessage'

export class InitUiDataEvent extends CVEvent<IMainScene> {
  public constructor(public readonly initUiData: InitUiData) {
    super('initUiData', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    initUiData: InitUiDataEvent
  }
}
