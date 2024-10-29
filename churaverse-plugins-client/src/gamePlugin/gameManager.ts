import { IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { SynchroBreakPlugin } from '@churaverse/synchro-break-plugin-client/synchroBreakPlugin'
import { SynchroBreakDialogManager } from '@churaverse/synchro-break-plugin-client/ui/startWindow/synchroBreakDialogManager'
import { BaseGamePlugin } from './domain/baseGamePlugin'
import { GameIds } from './interface/gameIds'
import { UnreferencedGameIdError } from './errors/unreferencedGameIdError'

export class GameManager {
  private readonly store: Store<IMainScene>
  private readonly bus: IEventBus<IMainScene>
  private readonly sceneName: IMainScene['sceneName']

  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>, sceneName: IMainScene['sceneName']) {
    this.store = store
    this.bus = bus
    this.sceneName = sceneName
    this.initGameDialogManager()
  }

  /**
   * ゲームダイアログを初期化する
   */
  private initGameDialogManager(): void {
    const gamePlugin = this.store.of('gamePlugin')
    gamePlugin.gameDialogRepository.set('synchroBreak', new SynchroBreakDialogManager(this.store, this.bus))
  }

  /**
   * gameIdに応じたゲームインスタンスを生成
   * @param isMidwayParticipate プレイヤーがゲームの途中参加者かどうかを判定するフラグ
   */
  public createGame(gameId: GameIds, isMidwayParticipate: boolean): void {
    let game: BaseGamePlugin
    // ゲーム開始時に入室しているプレイヤーがゲーム参加者に該当する
    const participateAllId = this.store.of('playerPlugin').players.getAllId()
    switch (gameId) {
      case 'synchroBreak':
        game = new SynchroBreakPlugin(this.store, this.bus, this.sceneName, participateAllId, isMidwayParticipate)
        break
      default:
        throw new UnreferencedGameIdError(gameId)
    }

    this.store.of('gamePlugin').gameRepository.set(gameId, game)
  }

  /**
   * gameIdに応じたゲームインスタンスを削除
   */
  public removeGame(gameId: GameIds): void {
    this.store.of('gamePlugin').gameRepository.delete(gameId)
  }

  /**
   * gameIdに応じたゲームインスタンスを取得
   */
  public getGame(gameId: GameIds): BaseGamePlugin | undefined {
    return this.store.of('gamePlugin').gameRepository.get(gameId)
  }
}
