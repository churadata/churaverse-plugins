import { PlayersRepository } from '../repository/playerRepository'
import { IPlayerRenderer } from '../domain/IPlayerRenderer'
import { IPlayerRendererFactory } from '../domain/IPlayerRendererFactory'
import { IDeathLogRenderer } from '../interface/IDeathLogRenderer'
import { DeathLogRepository } from '../ui/deathLog/deathLogRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    playerPlugin: PlayerPluginStore
  }
}

export interface PlayerPluginStore {
  readonly players: PlayersRepository
  readonly playerRenderers: Map<string, IPlayerRenderer>
  readonly playerRendererFactory: IPlayerRendererFactory
  readonly ownPlayerId: string
  readonly deathLogRenderer: IDeathLogRenderer
  readonly deathLogRepository: DeathLogRepository
}
