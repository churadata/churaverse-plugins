import { Microphone } from '../../../domain/localDevice/microphone'
import { JSXFunc } from 'churaverse-engine-client'
import { MIC_SELECT_TAG_ID } from '../micSelector'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import dialogStyle from '../../../../coreUiPlugin/settingDialog/style.module.scss'
import style from './MicSelectorComponent.module.scss'

interface Props {
  devices: Microphone[]
}

export const MicSelectorComponent: JSXFunc<Props> = ({ devices }: Props) => {
  return (
    <div className={style.micSelector}>
      <div className={dialogStyle.itemLabel}>マイク</div>
      <DeviceSelectorComponent selectorId={MIC_SELECT_TAG_ID} devices={devices} />
    </div>
  )
}
