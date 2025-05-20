import {
  IEventBus,
  IMainScene,
  Store,
  DomManager,
  domLayerSetting,
  makeLayerHigherTemporary,
  Direction,
} from 'churaverse-engine-client'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { NyokkiButtonComponent } from './component/NyokkiButtonComponent'
import { PlayerWalkEvent } from '@churaverse/player-plugin-client/event/playerWalkEvent'
import { NyokkiMessage } from '../../message/nyokkiMessage'
import { Scene } from 'phaser'

/** ニョッキボタンのHTML要素のID */
export const NYOKKI_BUTTON_ID = 'nyokki-button'

export class NyokkiButton implements IGameUiComponent {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private button!: HTMLElement

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly scene: Scene
  ) {}

  public initialize(): void {
    this.element = DomManager.addJsxDom(NyokkiButtonComponent())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.setupPopupButton()
  }

  private setupPopupButton(): void {
    this.button = DomManager.getElementById(NYOKKI_BUTTON_ID)
    this.button.onclick = () => {
      this.nyokki()
      this.close()
    }
  }

  /**
   * ニョッキボタンを押した時の挙動
   */
  private nyokki(): void {
    const playerPluginStore = this.store.of('playerPlugin')
    const playerId = playerPluginStore.ownPlayerId
    const nyokkiMessage = new NyokkiMessage({ playerId })
    this.store.of('networkPlugin').messageSender.send(nyokkiMessage)
    this.jumpOwnPlayer()
  }

  public open(): void {
    this.element.style.display = 'flex'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.button.remove()
  }

  /**
   * 自プレイヤーをジャンプさせる。
   */
  private jumpOwnPlayer(): void {
    const playerPluginStore = this.store.of('playerPlugin')
    const playerId = playerPluginStore.ownPlayerId
    const currentPos = playerPluginStore.players.get(playerId)?.position
    const direction = playerPluginStore.players.get(playerId)?.direction

    if (currentPos === undefined || direction === undefined) return
    // プレイヤーのFocus(カメラ追従)を一時停止
    this.scene.cameras.main.stopFollow()
    // ジャンプのためのwalkイベントをpost
    const JUMP_HEIGHT = 2
    const UP_SPEED = 0.5
    const LANDING_SPEED = 2
    currentPos.gridY -= JUMP_HEIGHT
    const jumpEvent = new PlayerWalkEvent(playerId, Direction.down, UP_SPEED, currentPos)
    this.eventBus.post(jumpEvent)
    setTimeout(() => {
      // 着地のためのwalkイベントをpost
      const landingEvent = new PlayerWalkEvent(playerId, Direction.down, LANDING_SPEED, currentPos)
      this.eventBus.post(landingEvent)
    }, 200)
  }
}
