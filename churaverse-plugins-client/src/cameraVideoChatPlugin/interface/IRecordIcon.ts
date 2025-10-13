import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer'

export interface IRecordIcon extends ITopBarIconRenderer {
  setActive: (isActive: boolean) => void
}
