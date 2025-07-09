import { IChurarenGameSequence } from '../interface/IChurarenGameSequence'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'
import { GamePluginStore } from '@churaverse/game-plugin-server/store/defGamePluginStore'
import { ChurarenStartCountdownEvent } from '../event/churarenStartCountdownEvent'
import { ChurarenStartTimerEvent } from '../event/churarenStartTimerEvent'
import { ChurarenResultEvent } from '../event/churarenResultEvent'
import { PlayerHealData, PlayerHealMessage } from '@churaverse/churaren-player-plugin-server/message/playerHealMessage'

const TIME_OUT_SECONDS = 30 // プレイヤーの準備確認のタイムアウト時間(秒)
const COUNTDOWN_TIME_SECONDS = 3 // カウントダウン時間(秒)
export const TIME_LIMIT_MINUTES = 3 * 60 // 制限時間(分)

export class ChurarenGameSequence implements IChurarenGameSequence {
  private readonly gamePluginStore: GamePluginStore

  public constructor(
    private readonly gameId: GameIds,
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  public async runSequence(): Promise<void> {
    await this.refillPlayersHp()
    await this.waitPlayerReady()
    if (!this.isActive) return
    await this.startCountdown()
    if (!this.isActive) return
    await this.startTimer()
    if (!this.isActive) return
    await this.handleTimeOver()
  }

  private async refillPlayersHp(): Promise<void> {
    const maxHP = 100
    this.gamePluginStore.games.get(this.gameId)?.participantIds.forEach((id) => {
      const player = this.store.of('playerPlugin').players.get(id)
      if (player === undefined) return
      player.hp = maxHP
      const playerHealData: PlayerHealData = {
        playerId: player.id,
        healAmount: maxHP,
      }
      const playerHealMessage = new PlayerHealMessage(playerHealData)
      this.store.of('networkPlugin').messageSender.send(playerHealMessage)
    })
  }

  private async waitPlayerReady(): Promise<void> {
    let timeOutRemaining: number = TIME_OUT_SECONDS
    const churarenParticipants = this.gamePluginStore.games.get(this.gameId)?.participantIds.length
    if (churarenParticipants === undefined) return
    await new Promise<void>((resolve) => {
      const checkReady: () => void = () => {
        if (!this.isActive) return
        const readyPlayerSize = this.store.of('churarenPlugin').readyPlayers.size
        if (readyPlayerSize === churarenParticipants) {
          resolve()
        } else if (timeOutRemaining <= 0) {
          resolve()
        } else {
          setTimeout(() => {
            timeOutRemaining -= 1
            checkReady()
          }, 1000)
        }
      }
      checkReady()
    })
  }

  private async startCountdown(): Promise<void> {
    this.eventBus.post(new ChurarenStartCountdownEvent())
    for (let i = COUNTDOWN_TIME_SECONDS; i > 0; i--) {
      if (!this.isActive) return
      await this.delay(1000)
    }
  }

  private async startTimer(): Promise<void> {
    this.eventBus.post(new ChurarenStartTimerEvent())
    for (let i = TIME_LIMIT_MINUTES; i > 0; i--) {
      if (!this.isActive) return
      await this.delay(1000)
    }
  }

  private async handleTimeOver(): Promise<void> {
    this.eventBus.post(new ChurarenResultEvent('timeOver'))
  }

  private get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
