export { type IChuraverseConfig, defineChuraverseConfig, getChuraverseConfig } from './churaverseConfig'
export type { IEventBus } from './eventbus/IEventBus'
export { EVENT_PRIORITY } from './eventbus/eventPriority'
export { startScenes } from './startScenes'

export { Direction, vectorToName, parse } from './domain/core/direction'
export { Position } from './domain/core/position'
export { type Vector } from './domain/core/vector'
export { WorldTime } from './domain/model/worldTime'

export { DamageCause, type DamageCauseType, type DamageCauseMap } from './domain/model/damageCause'
export { Entity } from './domain/model/entity'
export { LivingEntity } from './domain/model/livingEntity'
export { WeaponDamageCause } from './domain/model/weaponDamageCause'
export type { WeaponEntity } from './domain/model/weaponEntity'
export type { EntityRepository } from './domain/IRepository/entityRepository'

export { IMainScene } from './scene/IScene/IMainScene'
export { ITitleScene } from './scene/IScene/ITitleScene'
export { MainScene } from './scene/main'
export { TitleScene } from './scene/title'

export { Store } from './store/store'
export type { StoreInTitle, StoreInMain, StoreIn } from './store/store'
export type { UtilStoreInMain, UtilStoreInTitle } from './store/utilStore'

export const GRID_SIZE = 40

export type { Scenes, SceneMap, SceneName } from './scene/types'
export { BasePlugin } from './plugins/core/basePlugin/basePlugin'
export type { IPluginConfig } from './plugins/core/IPluginConfig'

export { CVError } from './error/cvError'
export { SceneUndefinedError } from './error/sceneUndefinedError'

export type { KnownKeyOf } from './utilTypes/knownKeyOf'
export type { Writable, PartialWritable } from './utilTypes/writeable'

export type { CVEventMap, CVEventType, CVMainEventMap, CVTitleEventMap } from './event/events'

export { CVEvent } from './event/cvEvent'
export { InitEvent } from './event/backendPhase/init'
export { StartEvent } from './event/backendPhase/start'
export { UpdateEvent } from './event/backendPhase/update'
export { SceneTransitionEvent } from './event/sceneTransitionEvent'

export { EntityDespawnEvent } from './event/entityEvent/entityDespawnEvent'
export { EntitySpawnEvent } from './event/entityEvent/entitySpawnEvent'
export { LivingDamageEvent } from './event/entityEvent/livingDamageEvent'
export { LivingHealEvent } from './event/entityEvent/livingHealEvent'
