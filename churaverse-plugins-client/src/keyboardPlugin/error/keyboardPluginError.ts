import { CVError } from 'churaverse-engine-client'

export class KeyboardPluginError extends CVError {
  static {
    this.prototype.name = 'KeyboardPluginError'
  }
}
