import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GameIds } from '../interface/gameIds'
import { IGameInfo } from '../interface/IGameInfo'
import { ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { ResponseGameEndMessage } from '../message/gameEndMessage'
import { ResponseGameStartMessage } from '../message/gameStartMessage'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { UpdateGameParticipantMessage } from '../message/updateGameParticipantMessage'
import { BaseGamePlugin } from './baseGamePlugin'

/**
 * BasicGamePluginを拡張したCoreなゲーム抽象クラス
 */
export abstract class CoreGamePlugin extends BaseGamePlugin implements IGameInfo {
  public abstract gameId: GameIds

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
  }

  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
  }

  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
  }

  private priorGameData(ev: PriorGameDataEvent): void {
    if (!this.isActive) return
    this.store
      .of('networkPlugin')
      .messageSender.send(new PriorGameDataMessage({ runningGameId: this.gameId }), ev.senderId)
  }

  private gameStart(ev: GameStartEvent): void {
    if (!this.isActive) return

    const gameStartMessage = new ResponseGameStartMessage({ gameId: this.gameId, playerId: ev.playerId })
    this.store.of('networkPlugin').messageSender.send(gameStartMessage)

    const gameParticipantMessage = new UpdateGameParticipantMessage({
      gameId: this.gameId,
      participantIds: this.participantIds,
    })
    this.store.of('networkPlugin').messageSender.send(gameParticipantMessage)
  }

  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gameAbortMessage = new ResponseGameAbortMessage({ gameId: this.gameId, playerId: ev.playerId })
    this.store.of('networkPlugin').messageSender.send(gameAbortMessage)
  }

  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gameEndMessage = new ResponseGameEndMessage({ gameId: this.gameId })
    this.store.of('networkPlugin').messageSender.send(gameEndMessage)
  }
}
