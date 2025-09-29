import { BaseKeyboardController } from '@churaverse/keyboard-plugin-client/interface/baseKeyboardController'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { RegisterKeyActionEvent } from '@churaverse/keyboard-plugin-client/event/registerKeyActionEvent'
import { KeyAction } from '@churaverse/keyboard-plugin-client/keyAction/keyAction'
import { RegisterKeyActionListenerEvent } from '@churaverse/keyboard-plugin-client/event/registerKeyActionListenerEvent'
import { IKeyActionListenerRegister } from '@churaverse/keyboard-plugin-client/interface/IKeyActionListenerRegister'
import { UseAlchemyItemEvent } from '../event/useAlchemyItemEvent'
import { PlayerItemsStore } from '@churaverse/churaren-player-plugin-client/store/defPlayerItemsStore'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private playerItemStore!: PlayerItemsStore
  private keyActionListenerRegister!: IKeyActionListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  // pluginへのキーアクション登録
  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('useAlchemyItem', 'E', 'inGame', 300))
  }

  public setupKeyActionListenerRegister(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    this.keyActionListenerRegister = ev.keyActionListenerRegister
  }

  public getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.playerItemStore = this.store.of('playerItemStore')
  }

  public registerKeyActionListener(): void {
    this.keyActionListenerRegister.on('useAlchemyItem', () => {
      this.useAlchemyItem()
    })
  }

  public unregisterKeyActionListener(): void {
    this.keyActionListenerRegister.off('useAlchemyItem', () => {
      this.useAlchemyItem()
    })
  }

  // キーアクションによって呼び出される処理
  private readonly useAlchemyItem = (): void => {
    if (this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)?.isDead ?? true) return
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayer = this.playerPluginStore.players.get(ownPlayerId)
    if (ownPlayer === undefined) return
    const alchemyItem = this.playerItemStore.alchemyItem.get(ownPlayerId)
    if (alchemyItem === undefined) return

    // 該当錬金アイテムに向けてイベント発行
    const useAlchemyItemEvent = new UseAlchemyItemEvent(ownPlayer, alchemyItem)
    this.eventBus.post(useAlchemyItemEvent)
  }
}
