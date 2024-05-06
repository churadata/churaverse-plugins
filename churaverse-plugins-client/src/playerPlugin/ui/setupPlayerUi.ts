import { Store, IMainScene, IEventBus, ITitleScene } from 'churaverse-engine-client'
import { SettingSection } from '@churaverse/core-ui-plugin-client/settingDialog/settingSection'
import { JoinLeaveLogRenderer } from './joinLeaveLogRenderer/joinLeaveLogRenderer'
import { PlayerColorButtons } from './playerSetting/playerColorButtons'
import { RenameForm } from './playerSetting/renameForm'
import '@churaverse/keyboard-plugin-client/store/defKeyboardPluginStore'
import '@churaverse/title-plugin-client/titlePlayerPlugin/defTitlePlayerTransitionData'

export function setupPlayerUi(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>): JoinLeaveLogRenderer {
  const transitionPluginStore = store.of('transitionPlugin')
  const playerPluginStore = store.of('playerPlugin')
  const uiStore = store.of('coreUiPlugin')
  const keyboardStore = store.of('keyboardPlugin')
  const player = transitionPluginStore.transitionManager.getReceivedData<ITitleScene>().ownPlayer
  uiStore.settingDialog.addSection(new SettingSection('playerSetting', 'プレイヤー設定'), 'head')
  RenameForm.build(playerPluginStore.ownPlayerId, player.name, uiStore.settingDialog, eventBus)

  PlayerColorButtons.build(playerPluginStore.ownPlayerId, player.color, uiStore.settingDialog, eventBus)

  keyboardStore.keySettingWindow.addKeyAction('walkDown', '下に移動')
  keyboardStore.keySettingWindow.addKeyAction('walkUp', '上に移動')
  keyboardStore.keySettingWindow.addKeyAction('walkRight', '右に移動')
  keyboardStore.keySettingWindow.addKeyAction('walkLeft', '左に移動')

  const fadeOutLogRenderer = uiStore.fadeOutLogRenderer
  const joinLeaveLogRenderer = new JoinLeaveLogRenderer(fadeOutLogRenderer)

  return joinLeaveLogRenderer
}
