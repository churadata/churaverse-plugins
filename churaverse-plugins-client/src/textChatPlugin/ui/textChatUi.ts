import { Store, IMainScene, IEventBus } from 'churaverse-engine-client'
import { IChatBoardRenderer } from './interface/IChatBoardRenderer'
import { ITextChatUi } from './interface/ITextChatUi'
import { TextChatBoard } from './textChatBoard/textChatBoard'
import { Badge } from './textChatDialog/badge'
import { TextChatDialog } from './textChatDialog/textChatDialog'
import { TextChatIcon } from './textChatDialog/textChatIcon'
import { IChatInputRenderer } from './textChatInput/IChatInputRenderer'
import { TextChatInput } from './textChatInput/textChatInput'
import { OwnPlayerUndefinedError } from '@churaverse/player-plugin-client/errors/ownPlayerUndefinedError'
import { IBadgeHolder } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconHasBadge'
import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'

export class TextChatUi implements ITextChatUi {
  public textChatDialog: TextChatDialog
  public textChatBoard: IChatBoardRenderer
  public textChatInput: IChatInputRenderer
  public textChatIcon: ITopBarIconRenderer & IBadgeHolder
  public constructor(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>) {
    this.textChatDialog = new TextChatDialog()
    this.textChatBoard = new TextChatBoard(store.of('playerPlugin').ownPlayerId, this.textChatDialog)
    
    const coreUiPluginStore = store.of('coreUiPlugin')
    const playerPluginStoreUi = store.of('playerPlugin')
    console.log({
      network_store_id: store.of('networkPlugin').socketId,
      player: playerPluginStoreUi.players
    })
    const player = playerPluginStoreUi.players.get(playerPluginStoreUi.ownPlayerId)
    if (player === undefined) throw new OwnPlayerUndefinedError()

    this.textChatInput = new TextChatInput(playerPluginStoreUi.ownPlayerId, player.name, this.textChatDialog, eventBus)

    this.textChatIcon = new TextChatIcon(
      coreUiPluginStore.switcher,
      this.textChatDialog,
      coreUiPluginStore.topBarIconContainer,
      new Badge()
    )
  }
}
