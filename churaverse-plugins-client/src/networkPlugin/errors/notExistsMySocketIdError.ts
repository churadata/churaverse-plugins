import { CVError } from 'churaverse-engine-client'

export class NotExistsMySocketIdError extends CVError {
  static {
    this.prototype.name = 'notExistsMySocketIdError'
  }
}
