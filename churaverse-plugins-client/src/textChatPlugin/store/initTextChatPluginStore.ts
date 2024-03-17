import { IMainScene, Store } from 'churaverse-engine-client'
import { TextChatPluginStore } from './defTextChatPluginStore'
import { TextChatService } from '../service/textChatService'

export function initTextChatPluginStore(store: Store<IMainScene>): void {
  const pluginStore: TextChatPluginStore = {
    textChatService: new TextChatService(),
  }
  store.setInit('textChatPlugin', pluginStore)
}
