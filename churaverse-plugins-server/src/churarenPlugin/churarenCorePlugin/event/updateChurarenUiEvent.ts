import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { UpdateChurarenUiType } from '@churaverse/churaren-engine-server/types/uiTypes'

export class UpdateChurarenUiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly uiType: UpdateChurarenUiType) {
    super('updateChurarenUi', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    updateChurarenUi: UpdateChurarenUiEvent
  }
}
