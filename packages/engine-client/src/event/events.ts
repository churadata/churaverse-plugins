import { IMainScene } from '../scene/IScene/IMainScene'
import { ITitleScene } from '../scene/IScene/ITitleScene'
import { Scenes } from '../scene/types'
import { KnownKeyOf } from '../utilTypes/knownKeyOf'
import { CVEvent } from './cvEvent'

/**
 * TitleSceneのEvent
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CVTitleEventMap {}

/**
 * MainSceneのEvent
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CVMainEventMap {}
export type CVEventMap<Scene extends Scenes> = Scene extends ITitleScene
  ? CVTitleEventMap & { [type: string]: CVEvent<ITitleScene> }
  : Scene extends IMainScene
  ? CVMainEventMap & { [type: string]: CVEvent<IMainScene> }
  : never

export type CVEventType<Scene extends Scenes> = KnownKeyOf<CVEventMap<Scene>>
