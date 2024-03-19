import { Scene } from 'phaser'
import { KeyCode } from './types/keyCode'
import { PhaserKeyboardNullError } from './error/phaserKeyboardNullError'

export class PhaserKeyCache {
  private readonly cache = new Map<KeyCode, Phaser.Input.Keyboard.Key>()

  public constructor(private readonly scene: Scene) {}

  public get(keyCode: KeyCode): Phaser.Input.Keyboard.Key {
    let phaserKey = this.cache.get(keyCode)

    if (phaserKey === undefined) {
      if (this.scene.input.keyboard === null) throw new PhaserKeyboardNullError()
      phaserKey = this.scene.input.keyboard.addKey(keyCode, false)
      this.cache.set(keyCode, phaserKey)
    }

    return phaserKey
  }
}
