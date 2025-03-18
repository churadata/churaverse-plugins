import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { IChurarenGameSequence } from '../interface/IChurarenGameSequence'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'
import { GamePluginStore } from '@churaverse/game-plugin-server/store/defGamePluginStore'
import { UpdateChurarenUiType } from '@churaverse/churaren-engine-server'
import { UpdateChurarenUiEvent } from '../event/updateChurarenUiEvent'

const COUNTDOWN_TIME = 3 // カウントダウン時間 3s
export const TIME_LIMIT = 3 * 60 // 3分
const RESULT_DISPLAY_TIME = 10 // 結果表示時間 10s

export class ChurarenGameSequence implements IChurarenGameSequence {
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>
  private readonly gamePluginStore: GamePluginStore

  private gameId!: GameIds

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  public async sequence(gameId: GameIds): Promise<void> {
    this.gameId = gameId
    await this.countdown()
    if (!this.isActive) return
    await this.timer()
    if (!this.isActive) return
    await this.timeOver()
  }

  public async countdown(): Promise<void> {
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
    await this.delay(RESULT_DISPLAY_TIME * 1000)
  }

  private changeUi(uiType: UpdateChurarenUiType): void {
    const updateChurarenUi = new UpdateChurarenUiEvent(uiType)
    this.eventBus.post(updateChurarenUi)
    console.log(`changeUi: ${uiType}`)
  }

  private get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
