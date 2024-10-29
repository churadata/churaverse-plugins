import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { GameStartEvent } from './event/gameStartEvent'
import { GameEndEvent } from './event/gameEndEvent'
import { GameManager } from './gameManager'
import { initGamePluginStore } from './store/initGamePluginStore'
import { GamePluginStore } from './store/defGamePluginStore'
import { GameAbortEvent } from './event/gameAbortEvent'
import { GameStartMessage } from './message/gameStartMessage'
import { GameAbortMessage } from './message/gameAbortMessage'
import { ToggleGameStateEvent } from './event/toggleGameStateEvent'
import { SocketController } from './controller/socketController'
import { InitialGameDataEvent } from './event/initialGameDataEvent'

export class GamePlugin extends BasePlugin<IMainScene> {
  private gamePluginStore!: GamePluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private gameManager!: GameManager

  public listenEvent(): void {
    this.bus.subscribeEvent('start', this.init.bind(this))

    const socketcontroller = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketcontroller.registerMessage.bind(socketcontroller))
    this.bus.subscribeEvent('registerMessageListener', socketcontroller.registerMessageListener.bind(socketcontroller))

    this.bus.subscribeEvent('initialGameData', this.initilaGameData.bind(this))
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
    this.bus.subscribeEvent('gameEnd', this.gameEnd.bind(this))
    this.bus.subscribeEvent('gameAbort', this.gameAbort.bind(this))
    this.bus.subscribeEvent('toggleGameState', this.toggleGameState.bind(this))
  }

  private init(): void {
    initGamePluginStore(this.store)
    this.gamePluginStore = this.store.of('gamePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.gameManager = new GameManager(this.store, this.bus, this.sceneName)
  }

  /**
   * ワールド入室時に進行中のゲームのダイアログアイコンのボタンを中断に変更する
   */
  private initilaGameData(ev: InitialGameDataEvent): void {
    for (const gameId of ev.runnigGameIds) {
      if (!this.gamePluginStore.gameRepository.has(gameId)) {
        this.gameManager.createGame(gameId, true)
        this.gamePluginStore.gameDialogRepository.get(gameId)?.setGameAbortButtonText()
        this.gamePluginStore.gameLogRenderer.gameMidwayJoinLog(gameId)
      }
    }
  }

  /**
   * ゲーム開始時に実行されるメソッド
   */
  private gameStart(ev: GameStartEvent): void {
    if (!this.gamePluginStore.gameRepository.has(ev.gameId)) {
      this.gameManager.createGame(ev.gameId, false)
      this.gamePluginStore.gameDialogRepository.get(ev.gameId)?.setGameAbortButtonText()
      this.gamePluginStore.gameLogRenderer.gameStartLog(ev.gameId, ev.playerId)
    }
  }

  /**
   * ゲーム終了時に実行されるメソッド
   */
  private gameEnd(ev: GameEndEvent): void {
    if (this.gamePluginStore.gameRepository.has(ev.gameId)) {
      this.gamePluginStore.gameLogRenderer.gameEndLog(ev.gameId)
      this.gameManager.removeGame(ev.gameId)
      this.gamePluginStore.gameDialogRepository.get(ev.gameId)?.setGameStartButtonText()
    }
  }

  /**
   * ゲーム中断時に実行されるメソッド
   */
  private gameAbort(ev: GameAbortEvent): void {
    if (this.gamePluginStore.gameRepository.has(ev.gameId)) {
      this.gamePluginStore.gameLogRenderer.gameAbortLog(ev.gameId, ev.playerId)
      this.gameManager.removeGame(ev.gameId)
      this.gamePluginStore.gameDialogRepository.get(ev.gameId)?.setGameStartButtonText()
    }
  }

  /**
   * ゲームの開始または中断のリクエストを処理する
   */
  private toggleGameState(ev: ToggleGameStateEvent): void {
    if (!this.gamePluginStore.gameRepository.has(ev.gameId)) {
      const gameStartMessage = new GameStartMessage({ gameId: ev.gameId, playerId: this.playerPluginStore.ownPlayerId })
      this.networkPluginStore.messageSender.send(gameStartMessage)
    } else {
      const gameAbortMessage = new GameAbortMessage({ gameId: ev.gameId, playerId: this.playerPluginStore.ownPlayerId })
      this.networkPluginStore.messageSender.send(gameAbortMessage)
    }
  }
}
