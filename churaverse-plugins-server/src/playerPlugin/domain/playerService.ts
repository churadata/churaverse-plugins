import { IPlayerRepository } from './IPlayerRepository'
import { Player } from './player'

/**
 * PlayerRepository内の全プレイヤーを微小時間分だけ移動
 */
export function movePlayers(dt: number, players: IPlayerRepository): void {
  players.getAllId().forEach((playerId) => {
    const player = players.get(playerId)
    if (player !== undefined) {
      player.move(dt)
      players.updateActor(playerId, player)
    }
  })
}

export function isPlayer(entity: unknown): entity is Player {
  if (typeof entity !== 'object' || entity === null) return false

  const e = entity as Partial<Player>
  return (
    typeof e.id === 'string' &&
    typeof e.hp === 'number' &&
    typeof e.spawnTime === 'number' &&
    typeof e.isCollidable === 'boolean' &&
    typeof e.role === 'string' &&
    typeof e.name === 'string' &&
    typeof e.color === 'string' &&
    e.position !== undefined &&
    typeof e.position.x === 'number' &&
    typeof e.position.y === 'number' &&
    e.direction !== undefined &&
    typeof e.direction.x === 'number' &&
    typeof e.direction.y === 'number' &&
    e.velocity !== undefined &&
    typeof e.velocity.x === 'number' &&
    typeof e.velocity.y === 'number'
  )
}
