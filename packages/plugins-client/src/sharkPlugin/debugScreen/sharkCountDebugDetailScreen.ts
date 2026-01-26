import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenContainer'
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
