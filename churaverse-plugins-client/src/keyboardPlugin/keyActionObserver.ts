import { IKeyFactory } from './interface/IKeyFactory'
import { Scenes } from 'churaverse-engine-client'
import { KeyAction } from './keyAction/keyAction'
import { KeyActionReceiver } from './keyActionReceiver'
import { KeyCode } from './types/keyCode'
import { IKey } from './interface/IKey'
import { IKeyContextManager } from './interface/IKeyContextManager'

/**
 * キーの入力状態を監視し, 条件が満たされた場合に監視しているKeyActionに紐づいたlistenerを実行する
 */
export class KeyActionObserver<Scene extends Scenes> {
  private key: IKey

  public constructor(
    private readonly myKeyAction: KeyAction<Scene>,
    private readonly keyFactory: IKeyFactory,
    private readonly keyContextManager: IKeyContextManager
  ) {
    this.key = keyFactory.createKey(this.myKeyAction.defaultKey, this.myKeyAction.interval)
  }

  /**
   * キーの入力状態を更新し、条件が満たされている場合はlistenerを実行する
   * @param dt
   * @param keyActionReceiver
   */
  public update(dt: number, keyActionReceiver: KeyActionReceiver<Scene>): void {
    if (
      this.myKeyAction.keyContext === 'universal' ||
      this.myKeyAction.keyContext === this.keyContextManager.nowContext
    ) {
      this._update(dt, keyActionReceiver)
    } else {
      this.key.resetHoldTime()
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _update(dt: number, keyActionReceiver: KeyActionReceiver<Scene>): void {
    this.key.updateHoldTime(dt)

    if (!this.myKeyAction.ignoreJustDown && this.key.isJustDown) {
      keyActionReceiver.execListeners(this.myKeyAction.type)
    } else if (this.key.isHold) {
      keyActionReceiver.execListeners(this.myKeyAction.type)
      this.key.resetHoldTime()
    }
  }

  /**
   * keyActionに紐付いているkeyCodeを変更する
   */
  public changeKeyCode(keyCode: KeyCode): void {
    this.myKeyAction.rebind(keyCode)
    this.key = this.keyFactory.createKey(this.myKeyAction.keyCode, this.myKeyAction.interval)
  }

  public get targetKeyAction(): KeyAction<Scene> {
    return this.myKeyAction
  }
}
