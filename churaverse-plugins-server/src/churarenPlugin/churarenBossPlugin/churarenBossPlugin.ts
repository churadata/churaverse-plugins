import {
  Direction,
  EntityDespawnEvent,
  EntitySpawnEvent,
  IMainScene,
  LivingDamageEvent,
  Position,
  UpdateEvent,
  Vector,
  WeaponDamageCause,
} from 'churaverse-engine-server'
import { BossPluginStore } from './store/defBossPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { Boss, CHURAREN_BOSS_SIZE, CHURAREN_BOSS_WALK_DURATION_MS } from './domain/boss'
import { SocketController } from './controller/socketController'
import { initBossPluginStore, resetBossPluginStore } from './store/initBossPluginStore'
import { walkBoss } from './domain/bossService'
import { BossSpawnData, BossSpawnMessage } from './message/bossSpawnMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BossWalkMessage } from './message/bossWalkMessage'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { CollisionBossDamageCause } from './domain/collisionBossDamageCause'
import { uniqueId, ChurarenEngine } from '@churaverse/churaren-engine-server'
import { WeaponDamageMessage } from '@churaverse/player-plugin-server/message/weaponDamageMessage'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { UpdateChurarenUiEvent } from '@churaverse/churaren-core-plugin-server/event/updateChurarenUiEvent'

import '@churaverse/bomb-plugin-server/store/defBombPluginStore'
import '@churaverse/shark-plugin-server/store/defSharkPluginStore'
import { Bomb } from '@churaverse/bomb-plugin-server/domain/bomb'
import { BombDamageCause } from '@churaverse/bomb-plugin-server/domain/bombDamageCause'
import { Shark } from '@churaverse/shark-plugin-server/domain/shark'
import { SharkDamageCause } from '@churaverse/shark-plugin-server/domain/sharkDamageCause'

const bossSpeedMultiplier = 2

export class ChurarenBossPlugin extends ChurarenEngine {
  private bossPluginStore!: BossPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private mapPluginStore!: MapPluginStore
  private socketController!: SocketController
  private readonly updatePositionTime = CHURAREN_BOSS_WALK_DURATION_MS
  private readonly halfBossSize: number = CHURAREN_BOSS_SIZE / 2

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap)
    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlapToBombs)
    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlapToSharks)
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnBoss)
    this.bus.subscribeEvent('updateChurarenUi', this.sendSpawnedBoss)
    this.bus.subscribeEvent('livingDamage', this.onLivingDamage)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnBoss)
    this.bus.unsubscribeEvent('updateChurarenUi', this.sendSpawnedBoss)
    this.bus.unsubscribeEvent('livingDamage', this.onLivingDamage)
  }

  protected handleGameStart(): void {
    this.subscribeGameEvent()
  }

  protected handleGameTermination(): void {
    this.unsubscribeGameEvent()
    this.removeBoss()
    resetBossPluginStore(this.store)
  }

  private readonly update = (ev: UpdateEvent): void => {
    walkBoss(ev.dt, this.bossPluginStore.bosses)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    initBossPluginStore(this.store)
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  // ボスを生成し、フロントに送信
  private readonly sendSpawnedBoss = (ev: UpdateChurarenUiEvent): void => {
    console.log('received updateChurarenUiEvent', ev)
    if (ev.uiType !== 'countTimer') return
    const worldMap = this.mapPluginStore.mapManager.currentMap
    const bossHp = 100
    let startPos = worldMap.getRandomSpawnPoint()

    if (this.isBossWalkInMap(startPos, worldMap)) {
      startPos = this.getLimitedBossPosition(worldMap)
    }
    const boss = new Boss(uniqueId(), startPos, Date.now(), bossHp)
    const bossSpawnData: BossSpawnData = {
      bossId: boss.bossId,
      startPos: startPos.toVector() as Vector & SendableObject,
      spawnTime: boss.spawnTime,
      bossHp: boss.hp,
    }
    const bossSpawnMessage = new BossSpawnMessage(bossSpawnData)
    this.networkPluginStore.messageSender.send(bossSpawnMessage)
    const bossSpawnEvent = new EntitySpawnEvent(boss)
    this.bus.post(bossSpawnEvent)
  }

  private readonly spawnBoss = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Boss)) return
    console.log('spawned boss', ev.entity)
    const boss = ev.entity
    this.bossPluginStore.bosses.set(boss.bossId, boss)
    const intervalId = setInterval(() => {
      if (boss.isDead || this.bossPluginStore.bosses.get(boss.bossId) === undefined) {
        clearInterval(intervalId)
        console.log('boss is dead or not found')
        return
      }
      this.onBossWalk(boss.bossId)
    }, this.updatePositionTime)
  }

  private onBossWalk(bossId: string): void {
    const boss = this.bossPluginStore.bosses.get(bossId)
    if (boss === undefined) return

    const currentMap = this.mapPluginStore.mapManager.currentMap
    const speed = currentMap.gridSize / CHURAREN_BOSS_WALK_DURATION_MS
    const position = boss.position.copy()

    // 移動先が画面外なら、ボスの行動を再生成
    for (const direction of this.shuffleDirection()) {
      const dest = boss.position.copy()
      dest.gridX = position.gridX + direction.x * bossSpeedMultiplier
      dest.gridY = position.gridY + direction.y * bossSpeedMultiplier
      if (!this.isBossWalkInMap(dest, currentMap)) {
        const velocity = { x: direction.x * speed * bossSpeedMultiplier, y: direction.y * speed * bossSpeedMultiplier }
        this.networkPluginStore.messageSender.send(
          new BossWalkMessage({
            startPos: position.toVector() as Vector & SendableObject,
            dest: dest.toVector() as Vector & SendableObject,
            direction,
            speed,
            bossId,
          })
        )
        boss.walk(position, direction, velocity)
        return
      }
    }
  }

  private removeBoss(): void {
    const bossIds = this.bossPluginStore.bosses.getAllId()
    for (const bossId of bossIds) {
      this.bossPluginStore.bosses.delete(bossId)
    }
  }

  private onCollisionPlayer(boss: Boss, player: Player): void {
    if (player.isDead) return
    if (!boss.isCollidable) return
    const collisionBossDamageCause = new CollisionBossDamageCause('collisionBoss', boss)
    const livingDamageEvent = new LivingDamageEvent(player, collisionBossDamageCause, boss.power)
    this.bus.post(livingDamageEvent)
  }

  private readonly onLivingDamage = (ev: LivingDamageEvent): void => {
    if (!(ev.target instanceof Boss)) return
    const boss = this.bossPluginStore.bosses.get(ev.target.bossId)
    if (boss === undefined) return

    // 錬金アイテムのダメージ処理
    // if (ev.cause instanceof ChurarenWeaponDamageCause) {
    //   const weaponDamageMessage = new WeaponDamageMessage({
    //     targetId: boss.bossId,
    //     cause: ev.cause.churarenWeaponName,
    //     weaponId: ev.cause.churarenWeapon.id,
    //     amount: ev.amount,
    //   })
    //   this.networkPluginStore.messageSender.send(weaponDamageMessage)
    //   boss.damage(ev.amount)
    // }

    // TODO:(DELETE) 錬金アイテム実装までの仮実装
    if (ev.cause instanceof WeaponDamageCause) {
      const weaponDamageMessage = new WeaponDamageMessage({
        targetId: boss.bossId,
        cause: ev.cause.name,
        weaponId: ev.cause.weapon.id,
        amount: ev.amount,
      })
      this.networkPluginStore.messageSender.send(weaponDamageMessage)
      boss.damage(ev.amount)
    }

    if (boss.isDead) {
      const updateChurarenUi = new UpdateChurarenUiEvent('win')
      this.bus.post(updateChurarenUi)

      const bossDespawnEvent = new EntityDespawnEvent(boss)
      this.bossPluginStore.bosses.delete(boss.bossId)
      this.bus.post(bossDespawnEvent)
    }
  }

  private readonly registerOnOverlap = (ev: RegisterOnOverlapEvent): void => {
    ev.collisionDetector.register(
      this.bossPluginStore.bosses,
      this.store.of('playerPlugin').players,
      this.onCollisionPlayer.bind(this)
    )
  }

  private isBossWalkInMap(dest: Position, currentMap: WorldMap): boolean {
    return (
      dest.x < this.halfBossSize ||
      dest.x >= currentMap.width - this.halfBossSize ||
      dest.y < this.halfBossSize ||
      dest.y >= currentMap.height - this.halfBossSize
    )
  }

  private shuffleDirection(): Direction[] {
    const directions = [Direction.up, Direction.down, Direction.left, Direction.right]
    return directions.sort(() => Math.random() - 0.5)
  }

  private getLimitedBossPosition(currentMap: WorldMap): Position {
    const limitX = currentMap.width / 2
    const limitY = currentMap.height / 2
    return new Position(limitX, limitY)
  }

  // 待機処理を行うためのヘルパー関数
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  // TODO:(DELETE) 以下は錬金アイテム実装までの仮実装
  private readonly registerOnOverlapToBombs = (ev: RegisterOnOverlapEvent): void => {
    ev.collisionDetector.register(
      this.store.of('bombPlugin').bombs,
      this.bossPluginStore.bosses,
      this.bombHitBoss.bind(this)
    )
  }

  private bombHitBoss(bomb: Bomb, boss: Boss): void {
    if (boss.isDead) return
    // 爆弾衝突イベントの発火
    const bombDamageCause = new BombDamageCause(bomb) // ダメージの原因を爆弾として保存
    const livingDamageEvent = new LivingDamageEvent(boss, bombDamageCause, bomb.power) // ボスへのダメージ処理
    this.bus.post(livingDamageEvent)
  }

  private readonly registerOnOverlapToSharks = (ev: RegisterOnOverlapEvent): void => {
    ev.collisionDetector.register(
      this.store.of('sharkPlugin').sharks,
      this.bossPluginStore.bosses,
      this.sharkHitBoss.bind(this)
    )
  }

  private sharkHitBoss(shark: Shark, boss: Boss): void {
    if (boss.isDead) return
    // サメ衝突イベントの発火
    shark.isDead = true
    const sharkDamageCause = new SharkDamageCause(shark) // ダメージの原因を爆弾として保存
    const livingDamageEvent = new LivingDamageEvent(boss, sharkDamageCause, shark.power) // ボスへのダメージ処理
    this.bus.post(livingDamageEvent)
  }
}
