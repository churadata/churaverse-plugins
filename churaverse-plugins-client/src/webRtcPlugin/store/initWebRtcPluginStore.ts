import { Store, IMainScene, ITitleScene } from 'churaverse-engine-client'
import { LkLocalCameraManager } from '../localDeviceManager/livekitApi/lkLocalCameraManager'
import { LkLocalMicrophoneManager } from '../localDeviceManager/livekitApi/lkLocalMicrophoneManager'
import { LkLocalSpeakerManager } from '../localDeviceManager/livekitApi/lkLocalSpeakerManager'
import { WebRtc } from '../webRtc'
import { WebRtcPluginStore } from './defWebRtcPluginStore'
import '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import '@churaverse/transition-plugin-client/store/defTransitionPluginStore'
import '@churaverse/title-plugin-client/titlePlayerPlugin/defTitlePlayerTransitionData'

export function initWebRtcPluginStore(store: Store<IMainScene>): void {
  const playerPluginStore = store.of('playerPlugin')
  const ownPlayerId = playerPluginStore.ownPlayerId

  const transitionPluginStore = store.of('transitionPlugin')
  const receivedData = transitionPluginStore.transitionManager.getReceivedData<ITitleScene>()
  console.log('[DEBUG] receivedData:', receivedData)
  console.log('[DEBUG] ownPlayer:', receivedData?.ownPlayer)
  const ownPlayerName = receivedData?.ownPlayer?.name ?? ownPlayerId
  console.log('[DEBUG] ownPlayerId:', ownPlayerId, 'ownPlayerName:', ownPlayerName)

  const webRtc = new WebRtc(ownPlayerId, ownPlayerName)

  const webRtcPluginStore: WebRtcPluginStore = {
    webRtc,
    localCameraManager: new LkLocalCameraManager(webRtc.room),
    localMicrophoneManager: new LkLocalMicrophoneManager(webRtc.room),
    localSpeakerManager: new LkLocalSpeakerManager(webRtc.room),
  }

  store.setInit('webRtcPlugin', webRtcPluginStore)
}
