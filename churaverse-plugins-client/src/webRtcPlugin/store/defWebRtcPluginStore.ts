import { ILocalCameraManager } from '../interface/ILocalDeviceManager/ILocalCameraManager'
import { ILocalMicrophoneManager } from '../interface/ILocalDeviceManager/ILocalMicrophoneManager'
import { ILocalSpeakerManager } from '../interface/ILocalDeviceManager/ILocalSpeakerManager'
import { WebRtc } from '../webRtc'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    webRtcPlugin: WebRtcPluginStore
  }
}

export interface WebRtcPluginStore {
  readonly webRtc: WebRtc
  readonly localCameraManager: ILocalCameraManager
  readonly localMicrophoneManager: ILocalMicrophoneManager
  readonly localSpeakerManager: ILocalSpeakerManager
}
