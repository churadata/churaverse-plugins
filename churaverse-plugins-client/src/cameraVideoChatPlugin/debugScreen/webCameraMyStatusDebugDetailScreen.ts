import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { IWebCameraMyStatusDebugDetailScreen } from './IDebugScreen/IWebCameraInfoDebugScreen'

export class WebCameraMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IWebCameraMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `IsOn: false`
    super(debugDetailScreenContainer, 'webCameraInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `IsOn: ${isOn.toString()}`
  }
}
