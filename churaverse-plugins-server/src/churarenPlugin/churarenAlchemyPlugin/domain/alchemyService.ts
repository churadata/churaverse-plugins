import { AlchemyPotMap, AlchemyPotInfo } from '../message/alchemyPotSpawnMessage'
import { AlchemyPot } from './alchemyPot'
import { uniqueId } from '@churaverse/churaren-core-plugin-server'
import { IAlchemyPotRepository } from './IAlchemyPotRepository'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { Position, Vector } from 'churaverse-engine-server'

/**
 *  alchemyPotsの生成をfrontendに通知する
 */
export function generatedAlchemyPotMap(alchemyPot: IAlchemyPotRepository, worldMap: WorldMap): AlchemyPotMap {
  const potsMap: AlchemyPotMap = {}
  const alchemyPotPosition = calculatePositions(worldMap.width, worldMap.height)

  for (const pos of alchemyPotPosition) {
    const pot = new AlchemyPot(uniqueId(), new Position(pos.x, pos.y))
    potsMap[pot.id] = alchemyPotInfoToSendableObject(pot)
    alchemyPot.set(pot.id, pot)
  }
  return potsMap
}

function alchemyPotInfoToSendableObject(pot: AlchemyPot): AlchemyPotInfo {
  const info: AlchemyPotInfo = {
    potId: pot.id,
    spawnPos: pot.position.toVector() as Vector & SendableObject,
  }
  return info
}

function calculatePositions(width: number, height: number): Vector[] {
  const centerX = width / 2
  const centerY = height / 2
  const offsetX = width / 20
  const offsetY = height / 20

  return [
    { x: centerX, y: offsetY }, // 上
    { x: centerX, y: height - offsetY }, // 下
    { x: offsetX, y: centerY }, // 左
    { x: width - offsetX, y: centerY }, // 右
    { x: centerX, y: centerY }, // 中央
  ]
}
