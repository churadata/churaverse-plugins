import { DeviceSelector } from './deviceSelector'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { ISettingDialog } from '@churaverse/core-ui-plugin-client/interface/ISettingDialog'
import { Microphone } from '../../domain/localDevice/microphone'
import { MicSelectorComponent } from './components/MicSelectorComponent'
import { ILocalMicrophoneManager } from '../../interface/ILocalDeviceManager/ILocalMicrophoneManager'

/**
 * マイクセレクタのHTML内にあるselectタグのid
 */
export const MIC_SELECT_TAG_ID = 'micSelector'

export class MicSelector extends DeviceSelector<Microphone> {
  public constructor(
    eventBus: IEventBus<IMainScene>,
    localMicManager: ILocalMicrophoneManager,
    settingDialog: ISettingDialog,
    mics: Microphone[]
  ) {
    super(eventBus, localMicManager, settingDialog, mics, MIC_SELECT_TAG_ID, MicSelectorComponent)
  }
}
