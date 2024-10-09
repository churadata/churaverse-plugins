import { IPlayerRenderer } from '@churaverse/player-plugin-client/domain/IPlayerRenderer'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { ITitleNameFieldRenderer } from '../domain/ITitleNameFieldRenderer'
import { ITitlePlayerRoleRenderer } from '../domain/ITitlePlayerRoleRenderer'

declare module 'churaverse-engine-client' {
  export interface StoreInTitle {
    titlePlayerPlugin: TitlePlayerPluginStore
  }
}

export interface TitlePlayerPluginStore {
  readonly ownPlayer: Player
  readonly previewPlayer: IPlayerRenderer
  readonly titleNameFieldRenderer: ITitleNameFieldRenderer
  readonly titlePlayerRoleRenderer: ITitlePlayerRoleRenderer
}
