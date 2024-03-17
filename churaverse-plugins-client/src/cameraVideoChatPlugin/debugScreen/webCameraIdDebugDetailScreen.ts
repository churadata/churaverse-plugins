import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { IWebCameraIdDebugDetailScreen } from './IDebugScreen/IWebCameraInfoDebugScreen'

export class WebCameraIdDebugDetailScreen extends BaseDebugDetailScreen implements IWebCameraIdDebugDetailScreen {
  private readonly cameraIds: Set<string> = new Set<string>()

  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `Ids: 0`
    super(debugDetailScreenContainer, 'webCameraInfo', element)
  }

  public update(id: string): void {
    if (this.cameraIds.has(id)) {
      this.cameraIds.delete(id)
    } else {
      this.cameraIds.add(id)
    }
    const connectedUsersCount = this.cameraIds.size
    const idsText = connectedUsersCount > 0 ? Array.from(this.cameraIds).join(', ') : ''
    this.content.innerText = `Ids: ${connectedUsersCount}\n${idsText}`
  }
}
