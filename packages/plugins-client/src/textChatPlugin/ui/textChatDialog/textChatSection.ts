import { Section } from '@churaverse/core-ui-plugin-client/dialog/section'
import { TextChatDialogSectionMap } from './textChatDialog'

export class TextChatSection extends Section<keyof TextChatDialogSectionMap> {}
