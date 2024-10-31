import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class TimeLimitConfirmEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly timeLimit: string
  ) {
    super('timeLimitConfirm', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    timeLimitConfirm: TimeLimitConfirmEvent
  }
}
