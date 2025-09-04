import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NetworkDisconnectEvent extends CVEvent<IMainScene> {
  public constructor(public readonly sessionId: string) {
    super('networkDisconnect', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    networkDisconnect: NetworkDisconnectEvent
  }
}
