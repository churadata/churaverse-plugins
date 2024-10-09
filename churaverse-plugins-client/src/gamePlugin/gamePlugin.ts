import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { GameStartEvent } from './event/gameStartEvent'
import { GameEndEvent } from './event/gameEndEvent'
import { GameLogRenderer } from './ui/logRenderer/gameLogRenderer'

export abstract class GamePlugin extends BasePlugin<IMainScene> {
  // ゲーム関係のログを描画するインスタンス
  protected readonly gameLogRenderer: GameLogRenderer
  public constructor(
    store: Store<IMainScene>,
    bus: IEventBus<IMainScene>,
    sceneName: IMainScene['sceneName'],
    gameLogRenderer: GameLogRenderer
  ) {
    super(store, bus, sceneName)
    this.gameLogRenderer = gameLogRenderer
  }

  // ゲーム開始の処理を行うメソッド
  public abstract gameStart(ev: GameStartEvent): void
  // ゲーム終了の処理を行うメソッド
  public abstract gameEnd(ev: GameEndEvent): void
}
