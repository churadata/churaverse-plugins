import { IMainScene, IMeetingScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import { MainToTitleData, TitleToMainData, TitleToMeetingData } from './defSceneTransitionData'

export type SceneTransitionData<From extends Scenes, To extends Scenes> = [From, To] extends [ITitleScene, IMainScene]
  ? TitleToMainData
  : [From, To] extends [ITitleScene, IMeetingScene]
  ? TitleToMeetingData
  : [From, To] extends [IMainScene, ITitleScene]
  ? MainToTitleData
  : null
