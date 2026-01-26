export { Churaverse } from './ChuraverseComponent'
export { type IChuraverseConfig, defineChuraverseConfig, getChuraverseConfig } from './churaverseConfig'
export type { IPluginConfig, IPluginConfigOptions } from './plugins/core/IPluginConfig'
export type { IEventBus } from './eventbus/IEventBus'
export { EVENT_PRIORITY } from './eventbus/eventPriority'

export * from './animation/animationConfig'

export { Direction, vectorToName, parse } from './domain/model/core/direction'
export { Position } from './domain/model/core/position'
export type { Vector } from './domain/model/core/vector'
export { WorldTime } from './domain/model/worldTime'

export { DamageCause, type DamageCauseType, type DamageCauseMap } from './domain/model/damageCause'
export { Entity } from './domain/model/entity'
export { LivingEntity } from './domain/model/livingEntity'
export { WeaponDamageCause } from './domain/model/weaponDamageCause'
export type { WeaponEntity } from './domain/model/weaponEntity'

export type { IFocusableRenderer } from './domain/interface/IFocusableRenderer'

export { IMainScene } from './scene/IScene/IMainScene'
export { ITitleScene } from './scene/IScene/ITitleScene'
export { MainScene } from './scene/main'
export { TitleScene } from './scene/title'

export { Store } from './store/store'
export type { StoreInTitle, StoreInMain, StoreIn } from './store/store'
export type { UtilStoreInMain, UtilStoreInTitle } from './store/utilStore'

export { uniqueId } from './uniqueId'

export { DomManager, type JSXFunc } from './ui/domManager'
export { layerSetting } from './ui/canvasLayer'
export { domLayerSetting } from './ui/domLayer'
export { makeLayerHigherTemporary } from './ui/makeLayerHigherTemporary'
export type { AbstractDOMLayerNames } from './ui/domLayer'
export { createUIContainer } from './ui/container'
export const GRID_SIZE = 40

export { HpBarRenderer } from './renderer/hpBarRenderer'

export type KeyCode = keyof typeof Phaser.Input.Keyboard.KeyCodes

export type { Scenes, SceneMap, SceneName } from './scene/types'
export { BasePlugin } from './plugins/core/basePlugin/basePlugin'

export { CVError } from './error/cvError'
export { SceneUndefinedError } from './error/sceneUndefinedError'
export { UIContainerNotFoundError } from './error/uiContainerNotFoundError'
export { UIError } from './error/uiError'
export { UINotFoundError } from './error/uiNotFoundError'

export type { KnownKeyOf } from './utilTypes/knownKeyOf'
export type { Writable, PartialWritable } from './utilTypes/writeable'

export type { CVEventMap, CVEventType, CVMainEventMap, CVTitleEventMap } from './event/events'

export { CVEvent } from './event/cvEvent'
export { PhaserLoadAssets } from './event/gamePhase/phaser/phaserLoadAssets'
export { PhaserSceneCreate } from './event/gamePhase/phaser/phaserSceneCreate'
export { PhaserSceneInit } from './event/gamePhase/phaser/phaserSceneInit'
export { PhaserScenePreload } from './event/gamePhase/phaser/phaserScenePreload'
export { PhaserSceneUpdate } from './event/gamePhase/phaser/phaserSceneUpdate'
export { InitEvent } from './event/gamePhase/init'
export { StartEvent } from './event/gamePhase/start'
export { UpdateEvent } from './event/gamePhase/update'
export { OnGameShutdownEvent } from './event/gamePhase/onGameShutdown'

export { EntityDespawnEvent } from './event/entityEvent/entityDespawnEvent'
export { EntitySpawnEvent } from './event/entityEvent/entitySpawnEvent'
export { LivingDamageEvent } from './event/entityEvent/livingDamageEvent'
export { LivingHealEvent } from './event/entityEvent/livingHealEvent'
