import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { IBombCountDebugDetailScreen } from './IDebugScreen/IBombCountDebugDetailScreen'

export class BombCountDebugDetailScreen extends BaseDebugDetailScreen implements IBombCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `BombCount: undefined`
    super(debugDetailScreenContainer, 'bombInfo', element)
  }

  public update(bombCount: number): void {
    this.content.textContent = `BombCount: ${bombCount}`
  }
}
