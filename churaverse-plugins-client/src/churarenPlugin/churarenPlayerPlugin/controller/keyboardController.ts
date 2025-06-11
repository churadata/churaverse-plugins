import { BaseKeyboardController } from '@churaverse/keyboard-plugin-client/interface/baseKeyboardController'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { RegisterKeyActionEvent } from '@churaverse/keyboard-plugin-client/event/registerKeyActionEvent'
import { KeyAction } from '@churaverse/keyboard-plugin-client/keyAction/keyAction'
import { RegisterKeyActionListenerEvent } from '@churaverse/keyboard-plugin-client/event/registerKeyActionListenerEvent'
import { IKeyActionListenerRegister } from '@churaverse/keyboard-plugin-client/interface/IKeyActionListenerRegister'
import { PlayerItemsStore } from '../store/defPlayerItemsStore'
import { DropChurarenItemEvent } from '../event/dropChurarenItemEvent'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private playerItemStore!: PlayerItemsStore
  private keyActionListenerRegister!: IKeyActionListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('dropItem1', 'ONE', 'inGame', 320))
    ev.keyActionRegister.registerKeyAction(new KeyAction('dropItem2', 'TWO', 'inGame', 320))
    ev.keyActionRegister.registerKeyAction(new KeyAction('dropItem3', 'THREE', 'inGame', 320))
  }

  public setupKeyActionListenerRegister(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    this.keyActionListenerRegister = ev.keyActionListenerRegister
  }

  public getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.playerItemStore = this.store.of('playerItemStore')
  }

  public registerKeyActionListener(): void {
    this.keyActionListenerRegister.on('dropItem1', () => {
      this.dropItem(1)
    })
    this.keyActionListenerRegister.on('dropItem2', () => {
      this.dropItem(2)
    })
    this.keyActionListenerRegister.on('dropItem3', () => {
      this.dropItem(3)
    })
  }

  public unregisterKeyActionListener(): void {
    this.keyActionListenerRegister.off('dropItem1', () => {
      this.dropItem(1)
    })
    this.keyActionListenerRegister.off('dropItem2', () => {
      this.dropItem(2)
    })
    this.keyActionListenerRegister.off('dropItem3', () => {
      this.dropItem(3)
    })
  }

  private readonly dropItem = (itemNumber: number): void => {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const item = this.playerItemStore.materialItems.get(ownPlayerId, itemNumber - 1)
    if (item == null) return
    const dropItemEvent = new DropChurarenItemEvent(ownPlayerId, item.itemId)
    this.eventBus.post(dropItemEvent)
  }
}
