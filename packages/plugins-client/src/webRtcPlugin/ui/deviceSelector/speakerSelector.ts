import { DeviceSelector } from './deviceSelector'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { ISettingDialog } from '@churaverse/core-ui-plugin-client/interface/ISettingDialog'
import { ILocalSpeakerManager } from '../../interface/ILocalDeviceManager/ILocalSpeakerManager'
import { SpeakerSelectorComponent } from './components/SpeakerSelectorComponent'
import { Speaker } from '../../domain/localDevice/speaker'

/**
 * スピーカーセレクタのHTML内にあるselectタグのid
 */
export const SPEAKER_SELECT_TAG_ID = 'speakerSelector'

export class SpeakerSelector extends DeviceSelector<Speaker> {
  public constructor(
    eventBus: IEventBus<IMainScene>,
    localSpeakerManager: ILocalSpeakerManager,
    settingDialog: ISettingDialog,
    speakers: Speaker[]
  ) {
    super(eventBus, localSpeakerManager, settingDialog, speakers, SPEAKER_SELECT_TAG_ID, SpeakerSelectorComponent)
  }
}
