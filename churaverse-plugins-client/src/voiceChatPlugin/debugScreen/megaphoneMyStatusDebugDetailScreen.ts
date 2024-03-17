import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
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
