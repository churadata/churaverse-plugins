import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { ResponseGameEndMessage } from '@churaverse/game-plugin-server/message/gameEndMessage'
// import { GameEndMessage } from '@churaverse/game-plugin-server/message/gameEndMessage'
// import { GameAbortMessage } from '@churaverse/game-plugin-server/message/gameAbortMessage'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { IGame } from '../interface/IGame'
import { NyokkiGameTurnEnd } from '../event/nyokkiGameTurnEnd'
import { NyokkiTurnEndMessage } from '../message/nyokkiTurnEndMessage'
import {
  NyokkiTurnSelectResponseData,
  NyokkiTurnSelectResponseMessage,
} from '../message/nyokkiTurnSelectResponseMessage'
import { ShowUiData, ShowUiMessage, UiName } from '../message/showUiMessage'
import { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'

const TIME_OUT = 120000

export class Game implements IGame {
  private readonly maxTurns: number = 10
  private timeLimit: number = 0
  private gameOwner!: string | undefined
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private turnSelectNumber!: number
  private turnCountNumber: number = 1
  private _isActive: boolean = false

  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    eventBus.subscribeEvent('start', this.getStores.bind(this))
  }

  private getStores(): void {
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public get isActive(): boolean {
    return this._isActive
  }

  public end(): void {
    this._isActive = false
    this.gameOwner = undefined
  }

  public async start(gameOwner: string): Promise<void> {
    if (this._isActive) return
    this._isActive = true
    this.gameOwner = gameOwner
    // ランキングボードの表示
    this.sendShowUiMessage('rankingBoard')
    await this.gameLoop()
  }

  private async gameLoop(): Promise<void> {
    await this.inputTurnSelect()
    await this.inputTimeLimit()

    if (!this._isActive) return
    while (this.turnCountNumber <= this.turnSelectNumber) {
      if (!this._isActive) return
      await this.inputBetCoin()
      if (!this._isActive) return
      await this.startCountdown()
      if (!this._isActive) return
      await this.onGame()
      if (!this._isActive) return
      await this.checkTurnCount()
      if (!this._isActive) return
      await this.turnResult()
    }

    await this.showResult()
  }

  // ゲームターンを通知する
  private async inputTurnSelect(): Promise<void> {
    if (!this._isActive) return

    // ターン入力に関する処理
    this.sendShowUiMessage('turnSelect')
    this.turnCountNumber = 1
    this.turnSelectNumber = await this.waitForPlayerInput('turnSelect')
    if (this.gameOwner === undefined) return
    const turn: NyokkiTurnSelectResponseData = {
      playerId: this.gameOwner,
      turnNumber: this.turnCountNumber,
      allTurn: this.turnSelectNumber,
    }
    const turnSelectMessage = new NyokkiTurnSelectResponseMessage(turn)
    this.networkPluginStore.messageSender.send(turnSelectMessage)
  }

  private async inputTimeLimit(): Promise<void> {
    if (!this._isActive) return

    // 制限時間の入力に関する処理
    this.sendShowUiMessage('timeLimit')
    this.timeLimit = await this.waitForPlayerInput('timeLimit')
  }

  private async inputBetCoin(): Promise<void> {
    if (!this._isActive) return

    // ベットコインの入力に関する処理
    this.sendShowUiMessage('betCoin')
    let timeOut: number = TIME_OUT

    await new Promise<void>((resolve) => {
      const checkInput = (): void => {
        this.abortGameIfNoGameOwner()
        if (!this._isActive) {
          resolve()
          return
        }

        const synchroBreakPluginStore = this.synchroBreakPluginStore
        const participantsNumber = Array.from(synchroBreakPluginStore.participants).filter((value) => !value[1]).length
        const didBetPlayerNumber = synchroBreakPluginStore.betCoinRepository.getPlayersBetCoinArray().length
        const playersBetCount = participantsNumber - didBetPlayerNumber

        if (playersBetCount <= 0) {
          resolve()
        } else if (timeOut <= 0) {
          resolve()
        } else {
          // 入力がまだの場合は少し待ってから再度チェック
          setTimeout(() => {
            timeOut -= 100
            checkInput()
          }, 100) // 100ms待機
        }
      }
      checkInput()
    })
  }

  private async startCountdown(): Promise<void> {
    if (!this._isActive) return

    // カウントダウンの処理
    this.sendShowUiMessage('startCountDown')

    for (let i = 3; i > 0; i--) {
      this.abortGameIfNoGameOwner()
      await this.delay(1000)
    }
  }

  private async onGame(): Promise<void> {
    if (!this._isActive) return

    // ゲーム中
    this.sendShowUiMessage('countdownTimer')
    this.sendShowUiMessage('nyokkiButton')

    let remainingTime = this.timeLimit

    while (remainingTime > 0) {
      this.abortGameIfNoGameOwner()
      await this.delay(1000)
      remainingTime--
    }
  }

  private async checkTurnCount(): Promise<void> {
    if (!this._isActive) return
    this.abortGameIfNoGameOwner()
  }

  private async turnResult(): Promise<void> {
    if (!this._isActive) return
    this.abortGameIfNoGameOwner()

    // 残りターンの計算とターン終了の通知
    const allTurn = this.turnSelectNumber
    this.turnCountNumber++
    const turnNumber = this.turnCountNumber
    this.nyokkiTurnEnd(turnNumber, allTurn)
    this.nyokkiCollectionClear()
  }

  private async showResult(): Promise<void> {
    if (!this._isActive) return
    this.nyokkiGameEnd()
    this.nyokkiCollectionClear()
    this.sendShowUiMessage('result')
    this.reset()
  }

  private nyokkiCollectionClear(): void {
    this.synchroBreakPluginStore.nyokkiCollection.clear()
  }

  // 待機処理を行うためのヘルパー関数
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async waitForPlayerInput(target: 'timeLimit' | 'turnSelect'): Promise<number> {
    let timeOut: number = TIME_OUT
    const defaultReturnValue = 0

    return await new Promise((resolve) => {
      const checkInput: () => void = () => {
        // gameOwnerがワールドに存在するかの確認
        this.abortGameIfNoGameOwner()
        if (!this._isActive) resolve(defaultReturnValue)
        if (!this._isActive) return

        const input: number | undefined = this.synchroBreakPluginStore[target]
        if (input !== undefined) {
          resolve(input)
        } else if (timeOut <= 0) {
          resolve(defaultReturnValue)
        } else {
          // 入力がまだの場合は少し待ってから再度チェック
          setTimeout(() => {
            timeOut -= 100
            checkInput()
          }, 100) // 100ms待機
        }
      }
      checkInput()
    })
  }

  // 一旦コメントアウトする
  private abortGameIfNoGameOwner(): void {
    const gameOwner = this.gameOwner
    console.log(gameOwner)
    // if (gameOwner === undefined || this.store.of('playerPlugin').players.get(gameOwner) === undefined) {
    //   this.abort()
    // }
  }

  // frontendでUIを表示するためのmsgを送信
  private sendShowUiMessage(uiName: UiName): void {
    if (this.gameOwner === undefined) throw new Error('gameOwner is undefined')
    const data: ShowUiData = { showUi: uiName, gameOwner: this.gameOwner }
    const showUiMessage = new ShowUiMessage(data)
    this.networkPluginStore.messageSender.send(showUiMessage)
  }

  // nyokkiターン終了イベントを通知する
  private nyokkiTurnEnd(turnNumber: number, allTurn: number): void {
    // ニョッキゲームに参加している全プレイヤーを取得

    const playerCoinArray = Array.from(this.synchroBreakPluginStore.participants.entries())
      .filter(([playerId, status]) => !status)
      .map(([playerId, status]) => playerId)

    // ニョッキアクションを実行したプレイヤーを取得
    const nyokkiCollection = this.synchroBreakPluginStore.nyokkiCollection.getAllPlayerId()
    // ニョッキアクションを実行していないプレイヤーIDを取得
    const noNyokkiPlayerIds = playerCoinArray.filter((playerId) => !nyokkiCollection.includes(playerId))
    const nyokkiTurnEndData = { turnNumber, allTurn, noNyokkiPlayerIds }
    const nyokkiTurnEndMessage = new NyokkiTurnEndMessage(nyokkiTurnEndData)
    this.networkPluginStore.messageSender.send(nyokkiTurnEndMessage)

    const nyokkiGameTurnEndEvent = new NyokkiGameTurnEnd()
    this.eventBus.post(nyokkiGameTurnEndEvent)
  }

  /*
  // ゲームの途中終了
  public abort(): void {
    if (!this._isActive) return
    this.reset()
    const nyokkiGameFinishMessage = new GameAbortMessage({ gameId: 'synchroBreak', playerId: this.gameOwner })
    this.networkPluginStore.messageSender.send(nyokkiGameFinishMessage)
  }
*/

  // nyokki終了イベントを通知する
  private nyokkiGameEnd(): void {
    const nyokkiGameEndMessage = new ResponseGameEndMessage({ gameId: 'synchroBreak' })
    this.networkPluginStore.messageSender.send(nyokkiGameEndMessage)
  }

  private reset(): void {
    this.synchroBreakPluginStore.timeLimit = undefined
    this.synchroBreakPluginStore.turnSelect = undefined
    this.end()
    this.synchroBreakPluginStore.playersCoinRepository.reset()
    this.synchroBreakPluginStore.participants.forEach((value, key) => {
      this.synchroBreakPluginStore.participants.set(key, false)
    })
  }
}
