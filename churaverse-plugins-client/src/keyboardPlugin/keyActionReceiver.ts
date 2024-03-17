import { Scenes } from 'churaverse-engine-client'
import { IKeyActionListener } from './interface/IKeyActionListener'
import { KeyActionType } from './keyAction/keyActions'
import { KeyActionListenerList } from './keyActionListenerList'

export class KeyActionReceiver<Scene extends Scenes> {
  private readonly listenersMap = new Map<KeyActionType<Scene>, KeyActionListenerList>()

  public on<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener): void {
    if (!this.listenersMap.has(type)) {
      this.listenersMap.set(type, [])
    }

    this.listenersMap.get(type)?.push(listener)
  }

  /**
   * on()で追加したlistenerを返す
   */
  public getListenerList<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType): KeyActionListenerList {
    return this.listenersMap.get(type) ?? []
  }

  /**
   * typeで指定したlistenersを実行
   */
  public execListeners<KeyActType extends KeyActionType<Scene> & string>(type: KeyActType): void {
    this.getListenerList(type).forEach((listener) => {
      listener()
    })
  }
}
