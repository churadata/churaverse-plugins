import { Scenes, SceneName } from 'churaverse-engine-server'
import { SendableObject } from '../types/sendable'
import { BaseMessage } from './baseMessage'

/**
 * Scene遷移のデータ
 */
export interface SceneTransitionData extends SendableObject {
  sceneName: SceneName
}

/**
 * Scene遷移したことをServerに通知するMessage
 */
export class SceneTransitionMessage extends BaseMessage<Scenes> {
  public constructor(public readonly data: SceneTransitionData) {
    super('sceneTransition', data)
  }
}

declare module './messages' {
  export interface MainMessageMap {
    sceneTransition: SceneTransitionMessage
  }

  export interface TitleMessageMap {
    sceneTransition: SceneTransitionMessage
  }
}
