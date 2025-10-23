import { IKey } from './interface/IKey'
import { IKeyStateGetter } from './interface/IKeyStateGetter'
import { KeyCode } from './types/keyCode'

export class Key implements IKey {
  /**
   * このキーが長押しされている時間(ms)
   */
  private holdTime = 0

  /**
   * キーが押されているかの論理値
   */
  private _logicalUp = false

  public get logicalUp(): boolean {
    return this._logicalUp
  }

  public constructor(
    public readonly keyCode: KeyCode,
    public readonly duration: number,
    private readonly keyStateGetter: IKeyStateGetter
  ) {}

  /**
   * キーを押下した瞬間のみtrue
   */
  public get isJustDown(): boolean {
    return this.keyStateGetter.isJustDown(this.keyCode)
  }

  /**
   * キーが押されていればtrue
   */
  public get isDown(): boolean {
    return this.keyStateGetter.isDown(this.keyCode)
  }

  /**
   * duration以上長押ししていた場合true
   */
  public get isHold(): boolean {
    return this.keyStateGetter.isDown(this.keyCode) && this.holdTime >= this.duration
  }

  /**
   * 強制的にHoldTimeを0にする
   */
  public resetHoldTime(): void {
    this.holdTime = 0
  }

  /**
   * キーが押されていればholdTimeを加算、押されてなければ0にする
   */
  public updateHoldTime(dt: number): void {
    if (this.keyStateGetter.isDown(this.keyCode)) {
      this.holdTime += dt
    } else {
      this.resetHoldTime()
    }
  }

  public logicalRelease(): void {
    this._logicalUp = true
  }

  public onPhysicalKeyDown(): void {
    this._logicalUp = false
  }
}
