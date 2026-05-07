import { ScreenRecordPluginError } from './screenRecordPluginError'

export class LivekitConfigUndefinedError extends ScreenRecordPluginError {
  public constructor() {
    super('LiveKitの環境変数が正しく読み込まれていません')
  }
}
