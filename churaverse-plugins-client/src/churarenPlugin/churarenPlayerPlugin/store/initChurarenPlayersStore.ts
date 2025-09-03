import { IMainScene, Store } from 'churaverse-engine-client'
import { ChurarenPlayersStore } from './defChurarenPlayersStore'
import { GhostPlayerListUi } from '../ui/ghostPlayerListUi/GhostPlayerListUi'
import { GhostModePlayerRepository } from '../repository/ghostModePlayerRepository'

export function initChurarenPlayersStore(store: Store<IMainScene>): void {
  const churarenPlayersStore: ChurarenPlayersStore = {
    ghostModePlayerRepository: new GhostModePlayerRepository(),
    ghostPlayerListUi: new GhostPlayerListUi(store),
  }

  store.setInit('churarenPlayerStore', churarenPlayersStore)
}

export function resetChurarenPlayersStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenPlayerStore')
}
