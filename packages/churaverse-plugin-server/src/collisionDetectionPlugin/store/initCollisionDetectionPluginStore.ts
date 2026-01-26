import { IMainScene, Store } from 'churaverse-engine-server'
import { CollisionDetector } from '../collisionDetector'
import { CollisionDetectionPluginStore } from './defCollisionDetectionPluginStore'

export function initCollisionDetectionPluginStore(
  store: Store<IMainScene>,
  collisionDetector: CollisionDetector
): void {
  const collisionDetectionPluginStore: CollisionDetectionPluginStore = {
    collisionDetector,
  }

  store.setInit('collisionDetectionPlugin', collisionDetectionPluginStore)
}
