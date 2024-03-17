import { IEventBus } from '../../../eventbus/IEventBus'
import { IMainScene } from '../../../scene/IScene/IMainScene'
import { RegisterKeyActionEvent } from '../../keyboardPlugin/event/registerKayActionEvent'
import { RegisterKeyActionListenerEvent } from '../../keyboardPlugin/event/registerKeyActionListenerEvent'
import { BaseKeyboardController } from '../../keyboardPlugin/interface/baseKeyboardController'
import { KeyAction } from '../../keyboardPlugin/keyAction/keyAction'
import { Store } from '../../store/store'
import { DebugScreenPluginStore } from '../store/defDebugScreenPluginStore'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  private debugScreenPluginStore!: DebugScreenPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
  }

  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('ToggleDebugScreen', 'P', 'inGame', Infinity))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('ToggleDebugScreen', this.toggleDebugScreen.bind(this))
  }

  private toggleDebugScreen(): void {
    const debugSummaryScreenContainer = this.debugScreenPluginStore.debugSummaryScreenContainer
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    if (debugSummaryScreenContainer.isOpen && debugDetailScreenContainer.isOpen) {
      debugSummaryScreenContainer.close()
      debugDetailScreenContainer.close()
    } else {
      debugSummaryScreenContainer.open()
      debugDetailScreenContainer.open()
    }
  }
}
