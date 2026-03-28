import { Section } from '@churaverse/core-ui-plugin-client/dialog/section'
import { GameDialogSectionMap } from './gameDialog'

export class GameSection extends Section<keyof GameDialogSectionMap> {}
