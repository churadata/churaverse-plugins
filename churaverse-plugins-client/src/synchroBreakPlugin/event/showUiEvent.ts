import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { UiName } from '../message/showUiMessage'

export class ShowUiEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly uiName: UiName,
    public readonly gameOwner: string
  ) {
    super('showUi', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    showUi: ShowUiEvent
  }
}
