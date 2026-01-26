import { NetworkPluginError } from './networkPluginError'

export class MessageManagerUndefinedError extends NetworkPluginError {
  static {
    this.prototype.name = 'MessageManagerUndefinedError'
  }

  public constructor() {
    super('messageManager is undefined')
  }
}
