import { PlayersRepository } from '../repository/playerRepository'
import { Store, IMainScene } from 'churaverse-engine-client'
import { IPlayerRenderer } from '../domain/IPlayerRenderer'
import { IPlayerRendererFactory } from '../domain/IPlayerRendererFactory'
import { PlayerPluginStore } from './defPlayerPluginStore'
import { DeathLogRenderer } from '../ui/deathLog/deathLogRenderer'
import { DeathLogRepository } from '../ui/deathLog/deathLogRepository'

export function initPlayerPluginStore(
  store: Store<IMainScene>,
  rendererFactory: IPlayerRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const playerPluginStore: PlayerPluginStore = {
    players: new PlayersRepository(),
    playerRenderers: new Map<string, IPlayerRenderer>(),
    ownPlayerId: store.of('networkPlugin').socketId,
    playerRendererFactory: rendererFactory,
    deathLogRenderer: new DeathLogRenderer(store.of('coreUiPlugin').fadeOutLogRenderer),
    deathLogRepository: new DeathLogRepository(),
  }
  console.log({
    ownPlayerId: store.of('networkPlugin').socketId
  })
  store.setInit('playerPlugin', playerPluginStore)
}
