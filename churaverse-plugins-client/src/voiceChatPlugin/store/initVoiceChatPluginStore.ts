import { Store, IMainScene } from 'churaverse-engine-client'
import { PlayerVoiceChatIcons } from '../ui/playerVoiceChatIcons'
import { VoiceChatPluginStore } from './defVoiceChatPluginStore'

export function initVoiceChatPluginStore(store: Store<IMainScene>): void {
  const voiceChatPluginStore: VoiceChatPluginStore = {
    playerVoiceChatUis: new Map<string, PlayerVoiceChatIcons>(),
  }

  store.setInit('voiceChatPlugin', voiceChatPluginStore)
}
