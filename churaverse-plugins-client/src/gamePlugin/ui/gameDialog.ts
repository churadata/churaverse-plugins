import { Dialog } from '@churaverse/core-ui-plugin-client/dialog/dialog'
import { GameSection } from './gameSection'
import { IGameDialog } from '../interface/IGameDialog'

export class GameDialog extends Dialog<GameSection> implements IGameDialog {
  public constructor() {
    const props = {
      dialogName: 'ゲーム',
    }
    super(props)
  }

  public static build(): Dialog<GameSection> {
    return new GameDialog()
  }
}

export interface GameDialogSectionMap {
  game: GameSection
}
