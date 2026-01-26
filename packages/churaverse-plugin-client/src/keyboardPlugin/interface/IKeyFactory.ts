import { KeyCode } from 'churaverse-engine-client'
import { IKey } from './IKey'

export interface IKeyFactory {
  createKey: (keyCode: KeyCode, durationMs: number) => IKey
}
