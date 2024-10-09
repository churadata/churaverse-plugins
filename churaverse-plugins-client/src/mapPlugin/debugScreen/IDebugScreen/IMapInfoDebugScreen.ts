import { IDebugScreen } from '@churaverse/debug-screen-plugin-client/debugScreen/IDebugScreen/IDebugScreen'
import { WorldMap } from '../../domain/worldMap'

export interface ICollisionCountDebugDetailScreen extends IDebugScreen<number> {}

export interface ISpawnCountDebugDetailScreen extends IDebugScreen<number> {}

export interface IWorldNameDebugScreen extends IDebugScreen<string> {}

export interface IWorldSizeDebugScreen extends IDebugScreen<WorldMap> {}
