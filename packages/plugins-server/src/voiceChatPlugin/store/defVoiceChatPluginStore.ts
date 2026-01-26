import { PlayersMegaphoneRepository } from '../repository/playersMegaphoneRepository'
import { PlayersMicRepository } from '../repository/playersMicRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    voiceChatPlugin: VoiceChatPluginStore
  }
}

export interface VoiceChatPluginStore {
  readonly playersMic: PlayersMicRepository
  readonly playersMegaphone: PlayersMegaphoneRepository
}
