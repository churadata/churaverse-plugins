import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { GameStartEvent } from '@churaverse/game-plugin-client/event/gameStartEvent'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'

export abstract class ChurarenEngine extends BasePlugin<IMainScene> {
  public gameId!: GameIds
  public listenEvent(): void {
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
  }

  private gameStart(ev: GameStartEvent): void {
    this.gameId = ev.gameId
    this.handleGameStart()
  }

  protected abstract handleGameStart(): void

  protected abstract handleGameTermination(): void
}
