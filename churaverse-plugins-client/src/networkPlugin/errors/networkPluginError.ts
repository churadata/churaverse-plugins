import { CVError } from 'churaverse-engine-client'

export class NetworkPluginError extends CVError {
  static {
    this.prototype.name = 'NetworkPluginError'
  }
}
