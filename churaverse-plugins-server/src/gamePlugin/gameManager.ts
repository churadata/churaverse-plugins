import { IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import { SynchroBreakPlugin } from '@churaverse/synchro-break-plugin-server/synchroBreakPlugin'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { BaseGamePlugin } from './domain/baseGamePlugin'
import { GameIds } from './interface/gameIds'
import { UnreferencedGameIdError } from './errors/unreferencedGameIdError'

export class GameManager {
  private readonly store: Store<IMainScene>
  private readonly bus: IEventBus<IMainScene>

  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>) {
    this.store = store
    this.bus = bus
  }

  /**
   * ゲームidに応じたゲームインスタンスを生成する
   */
  public createGame(gameId: GameIds): void {
    let game: BaseGamePlugin
    const gameParticipateAllId = this.store.of('playerPlugin').players.getAllId()
    switch (gameId) {
      case 'synchroBreak':
        game = new SynchroBreakPlugin(this.store, this.bus, gameParticipateAllId)
        break
      default:
        throw new UnreferencedGameIdError(gameId)
    }
    this.store.of('gamePlugin').gameRepository.set(gameId, game)
  }

  /**
   * ゲームidに応じたゲームインスタンスを削除する
   */
  public removeGame(gameId: GameIds): void {
    this.store.of('gamePlugin').gameRepository.delete(gameId)
  }

  /**
   * ゲームidに応じたゲームインスタンスを取得する
   */
  public getGame(gameId: GameIds): BaseGamePlugin | undefined {
    return this.store.of('gamePlugin').gameRepository.get(gameId)
  }
}
