import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { UpdateChurarenUiType } from '@churaverse/churaren-engine-client/types/uiTypes'

export class UpdateChurarenUiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly uiType: UpdateChurarenUiType) {
    super('updateChurarenUi', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    updateChurarenUi: UpdateChurarenUiEvent
  }
}
