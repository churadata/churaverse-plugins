import { Player } from '../../playerPlugin/domain/player'

declare module '../../transitionPlugin/sceneTransitionData/defSceneTransitionData' {
  export interface TitleToMainData {
    ownPlayer: Player
  }
}
