import { KeyCode } from '../types/keyCode'

export function toPhaserKeyCode(keyCode: string): KeyCode | undefined {
  if (keyCode.startsWith('Arrow')) {
    return keyCode.replace('Arrow', '').toUpperCase() as KeyCode
  }

  if (keyCode.length === 1) {
    return keyCode.toUpperCase() as KeyCode
  }
}
