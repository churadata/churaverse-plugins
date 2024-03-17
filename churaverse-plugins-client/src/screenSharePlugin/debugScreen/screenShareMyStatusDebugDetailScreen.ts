import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { IScreenShareMyStatusDebugDetailScreen } from './IDebugScreen/IScreenShareInfoDebugDetailScreen'

export class ScreenShareMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IScreenShareMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `IsOn: false`
    super(debugDetailScreenContainer, 'screenShareInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `IsOn: ${isOn.toString()}`
  }
}
