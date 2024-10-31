import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class SendBetCoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly betCoins: number
  ) {
    super('sendBetCoin', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    sendBetCoin: SendBetCoinEvent
  }
}
