import { IMainScene, IEventBus, Store, Position, uniqueId, EntitySpawnEvent } from 'churaverse-engine-client'
import { PlayerPluginStore } from '../../playerPlugin/store/defPlayerPluginStore'
import { Shark } from '../domain/shark'
import { RegisterKeyActionEvent } from '../../keyboardPlugin/event/registerKeyActionEvent'
import { KeyAction } from '../../keyboardPlugin/keyAction/keyAction'
import { RegisterKeyActionListenerEvent } from '../../keyboardPlugin/event/registerKeyActionListenerEvent'
import { BaseKeyboardController } from '../../keyboardPlugin/interface/baseKeyboardController'

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
    ev.keyActionRegister.registerKeyAction(new KeyAction('ShotShark', 'X', 'inGame', 300))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('ShotShark', this.sharkSpawn.bind(this))
  }

  private sharkSpawn(): void {
    if (this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)?.isDead ?? true) return
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayer = this.playerPluginStore.players.get(ownPlayerId)
    if (ownPlayer === undefined) return

    // 自プレイヤーの位置からgap分だけ前にずらしてサメを出す
    const gap = 65
    const startPos = ownPlayer.position.copy()
    const position = new Position(startPos.x + gap * ownPlayer.direction.x, startPos.y + gap * ownPlayer.direction.y)
    const shark = new Shark(uniqueId(), ownPlayerId, position, ownPlayer.direction, Date.now())
    const sharkSpawnEvent = new EntitySpawnEvent(shark)
    this.eventBus.post(sharkSpawnEvent)
  }
}
