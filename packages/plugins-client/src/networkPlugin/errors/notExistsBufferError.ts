import { Scenes } from 'churaverse-engine-client'
import { MessageType } from '../message/messages'
import { NetworkPluginError } from './networkPluginError'

export class NotExistsBufferError extends NetworkPluginError {
  static {
    this.prototype.name = 'NotExistsBufferError'
  }

  public constructor(type: MessageType<Scenes>) {
    super(`type: ${type}のMessageBufferが存在しない. registerMessage()を実行している必要がある`)
  }
}
