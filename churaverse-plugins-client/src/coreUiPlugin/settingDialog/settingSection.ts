import { Section } from '../dialog/section'
import { SettingDialogSectionMap } from './settingDialog'

export class SettingSection extends Section<keyof SettingDialogSectionMap> {}
