import { JSXFunc } from 'churaverse-engine-client'
import dialogStyle from '../../../../../plugins/coreUiPlugin/settingDialog/style.module.scss'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import { Camera } from '../../../domain/localDevice/camera'
import { CAMERA_SELECT_TAG_ID } from '../cameraSelector'
import style from './CameraSelectorComponent.module.scss'

interface Props {
  devices: Camera[]
}

export const CameraSelectorComponent: JSXFunc<Props> = ({ devices }: Props) => {
  return (
    <div className={style.cameraSelector}>
      <div className={dialogStyle.itemLabel}>カメラ</div>
      <DeviceSelectorComponent selectorId={CAMERA_SELECT_TAG_ID} devices={devices} />
    </div>
  )
}
