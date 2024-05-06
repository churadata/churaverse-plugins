import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenContainer'
import { IMegaphoneMyStatusDebugDetailScreen } from './IDebugScreen/IVoiceChatInfoDebugDetailScreen'

export class MegaphoneMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IMegaphoneMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `MegaphoneIsOn: True`
    super(debugDetailScreenContainer, 'voiceChatInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `MegaphoneIsOn: ${isOn.toString()}`
  }
}
