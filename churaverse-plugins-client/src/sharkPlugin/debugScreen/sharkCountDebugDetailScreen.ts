import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { ISharkCountDebugDetailScreen } from './IDebugScreen/ISharkCountDebugDetailScreen'

export class SharkCountDebugDetailScreen extends BaseDebugDetailScreen implements ISharkCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `SharkCount: undefined`
    super(debugDetailScreenContainer, 'sharkInfo', element)
  }

  public update(sharkCount: number): void {
    this.content.textContent = `SharkCount: ${sharkCount}`
  }
}
