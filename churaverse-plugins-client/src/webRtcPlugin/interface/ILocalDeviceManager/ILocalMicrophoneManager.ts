import { Microphone } from '../../domain/localDevice/microphone'
import { IBaseLocalDeviceManager } from './IBaseLocalDeviceManager'

/**
 * 接続されているマイクを管理する
 */
export interface ILocalMicrophoneManager extends IBaseLocalDeviceManager<Microphone> {}
