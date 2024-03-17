import { ITitleScene, Store } from 'churaverse-engine-client'
import { Player } from '../../../playerPlugin/domain/player'
import { TitlePlayerPluginStore } from './defTitlePlayerPlugin'
import { IPlayerRenderer } from '../../../playerPlugin/domain/IPlayerRenderer'
import { ITitleNameFieldRenderer } from '../domain/ITitleNameFieldRenderer'
import { ITitlePlayerRoleRenderer } from '../domain/ITitlePlayerRoleRenderer'

export function initTitlePlayerPluginStore(
  store: Store<ITitleScene>,
  ownPlayer: Player,
  preveiwPlayer: IPlayerRenderer,
  titleNameFieldRenderer: ITitleNameFieldRenderer,
  titlePlayerRoleRenderer: ITitlePlayerRoleRenderer
): void {
  const titlePlayerPluginStore: TitlePlayerPluginStore = {
    ownPlayer: ownPlayer,
    previewPlayer: preveiwPlayer,
    titleNameFieldRenderer: titleNameFieldRenderer,
    titlePlayerRoleRenderer: titlePlayerRoleRenderer,
  }
  store.setInit('titlePlayerPlugin', titlePlayerPluginStore)
}
