import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { IChurarenGameSequence } from '../interface/IChurarenGameSequence'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'
import { GamePluginStore } from '@churaverse/game-plugin-server/store/defGamePluginStore'
import { UpdateChurarenUiType } from '@churaverse/churaren-engine-server'
import { UpdateChurarenUiEvent } from '../event/updateChurarenUiEvent'
import { IGameInfo } from '@churaverse/game-plugin-server/interface/IGameInfo'
import { ChurarenPluginStore } from '../store/defChurarenPluginStore'

const COUNTDOWN_TIME = 3 // カウントダウン時間(sec)
export const TIME_LIMIT = 3 * 60 // 制限時間(min)
const TIME_OUT = 30 // タイムアウト時間(sec)

export class ChurarenGameSequence implements IChurarenGameSequence {
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>
  private readonly gamePluginStore: GamePluginStore
  private readonly churarenPluginStore!: ChurarenPluginStore
  private churarenGamePluginStore!: IGameInfo | undefined
  private readyPlayers!: Set<string>

  private gameId!: GameIds

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.gamePluginStore = this.store.of('gamePlugin')
    this.churarenPluginStore = this.store.of('churarenPlugin')
  }

  public async sequence(gameId: GameIds): Promise<void> {
    this.gameId = gameId
    this.churarenGamePluginStore = this.gamePluginStore.games.get(this.gameId)
    this.readyPlayers = this.churarenPluginStore.readyPlayers
    await this.onPlayerReady()
    if (!this.isActive) return
    await this.countdown()
    if (!this.isActive) return
    await this.timer()
    if (!this.isActive) return
    await this.timeOver()
  }

  private async onPlayerReady(): Promise<void> {
    let timeOut: number = TIME_OUT
    await new Promise<void>((resolve) => {
      const checkReady: () => void = () => {
        if (!this.isActive) return
        if (this.readyPlayers.size === this.churarenGamePluginStore?.participantIds.length) {
          resolve()
        } else if (timeOut <= 0) {
          resolve()
        }
        setTimeout(() => {
          timeOut -= 1
          checkReady()
        }, 1000)
      }
      checkReady()
    })
  }

  private async countdown(): Promise<void> {
    this.changeUi('startCount')
    for (let i = COUNTDOWN_TIME; i > 0; i--) {
      if (!this.isActive) return
      await this.delay(1000)
    }
  }

  private async timer(): Promise<void> {
    await this.delay(1000) // 表示が切り替わるための待ち時間
    this.changeUi('countTimer')
    for (let i = TIME_LIMIT; i > 0; i--) {
      if (!this.isActive) return
      await this.delay(1000)
    }
  }

  private async timeOver(): Promise<void> {
    this.changeUi('timeOver')
  }

  private changeUi(uiType: UpdateChurarenUiType): void {
    const updateChurarenUi = new UpdateChurarenUiEvent(uiType)
    this.eventBus.post(updateChurarenUi)
  }

  private get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
