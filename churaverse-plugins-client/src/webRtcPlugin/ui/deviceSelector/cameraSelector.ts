import { Camera } from '../../domain/localDevice/camera'
import { ILocalCameraManager } from '../../interface/ILocalDeviceManager/ILocalCameraManager'
import { DeviceSelector } from './deviceSelector'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { CameraSelectorComponent } from './components/CameraSelectorComponent'
import { ISettingDialog } from '@churaverse/core-ui-plugin-client/interface/ISettingDialog'

/**
 * カメラセレクタのHTML内にあるselectタグのid
 */
export const CAMERA_SELECT_TAG_ID = 'cameraSelector'

export class CameraSelector extends DeviceSelector<Camera> {
  public constructor(
    eventBus: IEventBus<IMainScene>,
    localCameraManager: ILocalCameraManager,
    settingDialog: ISettingDialog,
    cameras: Camera[]
  ) {
    super(eventBus, localCameraManager, settingDialog, cameras, CAMERA_SELECT_TAG_ID, CameraSelectorComponent)
  }
}
