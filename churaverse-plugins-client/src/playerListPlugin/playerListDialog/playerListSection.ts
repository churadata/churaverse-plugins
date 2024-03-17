import { Section } from '../../coreUiPlugin/dialog/section'
import { PlayerListDialogSectionMap } from './playerListDialog'

export class PlayerListSection extends Section {
  public constructor(public readonly sectionId: keyof PlayerListDialogSectionMap, sectionLabel: string) {
    super(sectionId, sectionLabel)
  }
}
