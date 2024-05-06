import { Player } from '@churaverse/player-plugin-client/domain/player'

declare module '@churaverse/transition-plugin-client/sceneTransitionData/defSceneTransitionData' {
  export interface TitleToMainData {
    ownPlayer: Player
  }
}
