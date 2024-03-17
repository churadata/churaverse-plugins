import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { IPlayerListRenderer } from '../../playerListPlugin/interface/IPlayerListRenderer'
import { PlayerListPluginStore } from '../../playerListPlugin/store/defPlayerListPluginStore'
import { Player } from '../../playerPlugin/domain/player'
import { OwnPlayerUndefinedError } from '../../playerPlugin/errors/ownPlayerUndefinedError'
import { PlayerNotExistsInPlayerRepositoryError } from '../../playerPlugin/errors/playerNotExistsInPlayerRepositoryError'
import { PlayerPluginStore } from '../../playerPlugin/store/defPlayerPluginStore'
import { KickButton } from './kickButton/kickButton'

export class KickPluginUi {
  private readonly playerPluginStore: PlayerPluginStore
  private readonly playerListPluginStore: PlayerListPluginStore

  public constructor(private readonly eventBus: IEventBus<IMainScene>, private readonly store: Store<IMainScene>) {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.playerListPluginStore = this.store.of('playerListPlugin')

    this.addKickButtonToPlayerList(eventBus, this.playerListPluginStore.playerListUi.playerList)
  }

  private addKickButtonToPlayerList(eventBus: IEventBus<IMainScene>, playerListRenderer: IPlayerListRenderer): void {
    const ownPlayer = this.playerPluginStore.players.get(this.playerPluginStore.ownPlayerId)
    if (ownPlayer === undefined) throw new OwnPlayerUndefinedError()

    playerListRenderer.addRowContentCreator((playerId) => {
      const player = this.playerPluginStore.players.get(playerId)
      if (player === undefined) throw new PlayerNotExistsInPlayerRepositoryError(playerId)

      const shouldDisplay = this.hasKickPermission(ownPlayer) && ownPlayer.id !== player.id
      const button = new KickButton(shouldDisplay, ownPlayer, player, eventBus)

      return button.node
    })
  }

  private hasKickPermission(player: Player): boolean {
    if (player.role === 'admin') {
      return true
    } else {
      return false
    }
  }
}
