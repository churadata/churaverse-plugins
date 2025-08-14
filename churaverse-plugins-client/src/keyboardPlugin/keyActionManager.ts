import { Scenes } from 'churaverse-engine-client'
import { NotExistsKeyActionError } from './error/notExistsKeyActionError'
import { IKeyActionDispatcher } from './interface/IKeyActionDispatcher'
import { IKeyActionKeyCodeBinder } from './interface/IKeyActionKeyCodeBinder'
import { IKeyActionListener } from './interface/IKeyActionListener'
import { IKeyActionListenerRegister } from './interface/IKeyActionListenerRegister'
import { IKeyActionRegister } from './interface/IKeyActionRegister'
import { IKeyFactory } from './interface/IKeyFactory'
import { IKeyFactorySetter } from './interface/IKeyFactorySetter'
import { KeyAction } from './keyAction/keyAction'
import { KeyActionType } from './keyAction/keyActions'
import { KeyActionObserver } from './keyActionObserver'
import { KeyActionReceiver } from './keyActionReceiver'
import { KeyContextManager } from './keyContextManager'
import { KeyCode } from './types/keyCode'

export class KeyActionManager<Scene extends Scenes>
  implements
    IKeyActionRegister<Scene>,
    IKeyActionListenerRegister<Scene>,
    IKeyActionKeyCodeBinder<Scene>,
    IKeyFactorySetter,
    IKeyActionDispatcher<Scene>
{
  private readonly keyActionReceiver = new KeyActionReceiver<Scene>()
  private readonly keyActionObservers = new Map<KeyActionType<Scene>, KeyActionObserver<Scene>>()
  public readonly keyContextManager = new KeyContextManager()

  public constructor(
    private keyFactory: IKeyFactory,
    private readonly savedKeyBindInfo: Map<KeyActionType<Scene>, KeyCode>
  ) {}

  public registerKeyAction(keyAction: KeyAction<Scene>): void {
    const observer = new KeyActionObserver(keyAction, this.keyFactory, this.keyContextManager)

    // 保存済みのkeyBindがあれば上書き
    const savedKeyCode = this.savedKeyBindInfo.get(keyAction.type)
    if (savedKeyCode !== undefined) {
      observer.changeKeyCode(savedKeyCode)
    }

    this.keyActionObservers.set(keyAction.type, observer)
  }

  public getRegistered(type: KeyActionType<Scene> & string): KeyAction<Scene> {
    const keyAction = this.keyActionObservers.get(type)?.targetKeyAction
    if (keyAction === undefined) throw new NotExistsKeyActionError(type)
    return keyAction
  }

  public getAllRegistered(): Array<KeyAction<Scene>> {
    return Array.from(this.keyActionObservers.values()).map((observer) => {
      return observer.targetKeyAction
    })
  }

  public on<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener): void {
    this.keyActionReceiver.on(type, listener)
  }

  public off<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener): void {
    this.keyActionReceiver.off(type, listener)
  }

  public rebindKey(type: KeyActionType<Scene>, newKeyCode: KeyCode): void {
    this.keyActionObservers.get(type)?.changeKeyCode(newKeyCode)
  }

  public set(keyFactory: IKeyFactory): void {
    this.keyFactory = keyFactory
  }

  public dispatch(type: KeyActionType<Scene> & string): void {
    this.keyActionReceiver.execListeners(type)
  }

  public update(dt: number): void {
    this.keyActionObservers.forEach((observer) => {
      observer.update(dt, this.keyActionReceiver)
    })
  }
}
