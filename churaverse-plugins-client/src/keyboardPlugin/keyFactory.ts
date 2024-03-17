import { IKeyFactory } from './interface/IKeyFactory'
import { KeyCode } from './types/keyCode'
import { Key } from './key'
import { IKey } from './interface/IKey'
import { IKeyStateGetter } from './interface/IKeyStateGetter'

export class KeyFactory implements IKeyFactory {
  public constructor(private readonly keyStateGetter: IKeyStateGetter) {}

  public createKey(keyCode: KeyCode, durationMs: number): IKey {
    return new Key(keyCode, durationMs, this.keyStateGetter)
  }
}
