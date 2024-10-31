import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class TimeLimitConfirmEvent extends CVEvent<IMainScene> {
  public constructor(public readonly timelimit: string) {
    super('timeLimitConfirm', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    timeLimitConfirm: TimeLimitConfirmEvent
  }
}
