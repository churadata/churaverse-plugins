import { IMainScene, IEventBus, Store, Position, uniqueId, EntitySpawnEvent } from 'churaverse-engine-client'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { Flare } from '../domain/flare'
import { RegisterKeyActionEvent } from '@churaverse/keyboard-plugin-client/event/registerKeyActionEvent'
import { KeyAction } from '@churaverse/keyboard-plugin-client/keyAction/keyAction'
import { RegisterKeyActionListenerEvent } from '@churaverse/keyboard-plugin-client/event/registerKeyActionListenerEvent'
import { BaseKeyboardController } from '@churaverse/keyboard-plugin-client/interface/baseKeyboardController'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('releaseFlare', 'F', 'inGame', 300))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('releaseFlare', this.flareSpawn.bind(this))
  }

  private flareSpawn(): void {
    if (this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)?.isDead ?? true) return
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayer = this.playerPluginStore.players.get(ownPlayerId)
    if (ownPlayer === undefined) return


    // 自プレイヤーの位置からgap分だけ前にずらして炎を出す
    const gap = 65
    const startPos = ownPlayer.position.copy()
    const position = new Position(startPos.x + gap * ownPlayer.direction.x, startPos.y + gap * ownPlayer.direction.y)
    const flare = new Flare(uniqueId(), ownPlayerId, position, ownPlayer.direction, Date.now())
    const flareSpawnEvent = new EntitySpawnEvent(flare)
    this.eventBus.post(flareSpawnEvent)
  }
}
