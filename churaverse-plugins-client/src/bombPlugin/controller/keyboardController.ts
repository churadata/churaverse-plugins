import { IMainScene, IEventBus, Store, Position, uniqueId, EntitySpawnEvent } from 'churaverse-engine-client'
import { RegisterKeyActionEvent } from '../../keyboardPlugin/event/registerKeyActionEvent'
import { RegisterKeyActionListenerEvent } from '../../keyboardPlugin/event/registerKeyActionListenerEvent'
import { BaseKeyboardController } from '../../keyboardPlugin/interface/baseKeyboardController'
import { KeyAction } from '../../keyboardPlugin/keyAction/keyAction'
import { PlayerPluginStore } from '../../playerPlugin/store/defPlayerPluginStore'
import { Bomb } from '../domain/bomb'

/**
 * Keyboardの入力をInteractorに渡す
 * ロジックは書かない
 */
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
    ev.keyActionRegister.registerKeyAction(new KeyAction('DropBomb', 'Z', 'inGame', 320))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('DropBomb', this.bombDrop.bind(this))
  }

  private bombDrop(): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const player = this.playerPluginStore.players.get(ownPlayerId)
    if (player === undefined) return
    if (player.isDead) return

    const startPos = player.position.copy()
    const position = new Position(startPos.x, startPos.y)
    const bomb = new Bomb(uniqueId(), ownPlayerId, position, player.direction, Date.now())
    const bombSpawnEvent = new EntitySpawnEvent(bomb)

    this.eventBus.post(bombSpawnEvent)
  }
}
