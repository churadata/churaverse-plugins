import { KeyboardPluginError } from './keyboardPluginError'

export class KeyActionManagerUndefinedError extends KeyboardPluginError {
  static {
    this.prototype.name = 'KeyActionManagerUndefinedError'
  }

  public constructor() {
    super('keyActionManager is undefined')
  }
}
