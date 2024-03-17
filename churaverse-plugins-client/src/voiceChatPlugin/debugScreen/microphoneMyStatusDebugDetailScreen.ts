import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { IMicrophoneMyStatusDebugDetailScreen } from './IDebugScreen/IVoiceChatInfoDebugDetailScreen'

export class MicrophoneMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IMicrophoneMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `MicrophoneIsOn: false`
    super(debugDetailScreenContainer, 'voiceChatInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `MicrophoneIsOn: ${isOn.toString()}`
  }
}
