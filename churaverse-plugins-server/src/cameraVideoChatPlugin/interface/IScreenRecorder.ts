import { ScreenRecordStatusChangedEvent } from '../event/screenRecordStatusChangedEvent'

/**
 * 画面録画の開始/終了を送信するクラス
 */
export interface IScreenRecorder {
  toggleRecord: (ev: ScreenRecordStatusChangedEvent) => Promise<void>
}
