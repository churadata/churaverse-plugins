import { BaseDebugDetailScreen } from '../../debugScreenPlugin/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '../../debugScreenPlugin/debugScreen/debugDetailScreenContainer'
import { ICollisionCountDebugDetailScreen } from './IDebugScreen/IMapInfoDebugScreen'

export class CollisionCountDebugDetailScreen extends BaseDebugDetailScreen implements ICollisionCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `CollisionCount: undefined`
    super(debugDetailScreenContainer, 'mapInfo', element)
  }

  public update(collision: number | undefined): void {
    this.content.textContent = `CollisionCount: ${collision ?? 'undefined'}`
  }
}
