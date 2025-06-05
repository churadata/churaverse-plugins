import { IPlayer } from '@churaverse/player-plugin-server/dist/types/interface/IPlayer'

export function isPlayer(entity: unknown): entity is IPlayer {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    entity.constructor.name === 'Player' &&
    'id' in entity &&
    'color' in entity &&
    'name' in entity &&
    'velocity' in entity &&
    'isDead' in entity &&
    'role' in entity &&
    'spawnTime' in entity &&
    'isCollidable' in entity
  )
}
