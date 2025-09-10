import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * カメラの有効/無効が完了したときに発火するイベント
 */
export class EnableVideoChatButtonEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('enableVideoChatButton', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    enableVideoChatButton: EnableVideoChatButtonEvent
  }
}
