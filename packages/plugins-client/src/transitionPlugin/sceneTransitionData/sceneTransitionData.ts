import { IMainScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import { MainToTitleData, TitleToMainData } from './defSceneTransitionData'

export type SceneTransitionData<From extends Scenes, To extends Scenes> = [From, To] extends [ITitleScene, IMainScene]
  ? TitleToMainData
  : [From, To] extends [IMainScene, ITitleScene]
  ? MainToTitleData
  : null
