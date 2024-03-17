import { IMainScene } from 'churaverse-engine-client'
import { RegisterKeyActionEvent } from '../../keyboardPlugin/event/registerKeyActionEvent'
import { RegisterKeyActionListenerEvent } from '../../keyboardPlugin/event/registerKeyActionListenerEvent'
import { BaseKeyboardController } from '../../keyboardPlugin/interface/baseKeyboardController'
import { KeyAction } from '../../keyboardPlugin/keyAction/keyAction'
import { FocusNextTargetEvent } from '../event/focusNextTargetEvent'

export class KeyboardController extends BaseKeyboardController<IMainScene> {
  public registerKeyAction(ev: RegisterKeyActionEvent<IMainScene>): void {
    ev.keyActionRegister.registerKeyAction(new KeyAction('focusNext', 'V', 'inGame', Infinity))
  }

  public registerKeyActionListener(ev: RegisterKeyActionListenerEvent<IMainScene>): void {
    ev.keyActionListenerRegister.on('focusNext', this.focusNextTarget.bind(this))
  }

  private focusNextTarget(): void {
    this.eventBus.post(new FocusNextTargetEvent())
  }
}
