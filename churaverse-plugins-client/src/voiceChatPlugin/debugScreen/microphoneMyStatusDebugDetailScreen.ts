import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenContainer'
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
