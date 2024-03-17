import { Scenes } from 'churaverse-engine-client'
import { KeyActionType } from '../keyAction/keyActions'
import { KeyboardPluginError } from './keyboardPluginError'

export class NotExistsKeyActionError<Scene extends Scenes> extends KeyboardPluginError {
  static {
    this.prototype.name = 'NotExistsKeyActionError'
  }

  public constructor(type: KeyActionType<Scene> & string) {
    super(`type: ${type}のKeyActionが存在しない. registerKeyAction()を実行している必要がある`)
  }
}
