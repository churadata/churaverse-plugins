import { KeyboardPluginError } from './keyboardPluginError'

export class PhaserKeyboardNullError extends KeyboardPluginError {
  static {
    this.prototype.name = 'PhaserKeyboardNullError'
  }

  public constructor() {
    super('scene.input.keyboard is null.')
  }
}
