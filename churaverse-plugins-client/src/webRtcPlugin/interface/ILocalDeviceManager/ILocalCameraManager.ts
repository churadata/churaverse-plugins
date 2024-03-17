import { Camera } from '../../domain/localDevice/camera'
import { IBaseLocalDeviceManager } from './IBaseLocalDeviceManager'

/**
 * 接続されているカメラを管理する
 */
export interface ILocalCameraManager extends IBaseLocalDeviceManager<Camera> {}
