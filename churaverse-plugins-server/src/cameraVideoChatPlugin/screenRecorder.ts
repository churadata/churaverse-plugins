import { IMainScene, Store } from 'churaverse-engine-server'
import { IScreenRecorder } from './interface/IScreenRecorder'
import { ScreenRecordStatusChangedEvent } from './event/screenRecordStatusChangedEvent'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { ScreenRecordStartMessage } from './message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from './message/screenRecordStopMessage'

export class ScreenRecorder implements IScreenRecorder {
  private egressId: string | undefined
  private readonly roomName: string = 'room1'
  private readonly backendLivekitUrl: string = process.env.BACKEND_LIVEKIT_URL ?? 'http://backend_livekit:12150'
  private recordingTimer: NodeJS.Timeout | undefined
  private readonly maxRecordingDuration: number = 8 * 60 * 60 * 1000 // 8時間

  private readonly networkPluginStore: NetworkPluginStore<IMainScene>

  public constructor(store: Store<IMainScene>) {
    this.networkPluginStore = store.of('networkPlugin')
  }

  public async toggleRecord(ev: ScreenRecordStatusChangedEvent): Promise<void> {
    if (ev.isRecording) {
      const result = await this.startRecord()
      if (!result) return
      this.setupTimer()
      this.networkPluginStore.messageSender.send(new ScreenRecordStartMessage())
    } else {
      const result = await this.stopRecord()
      if (!result) return
      this.networkPluginStore.messageSender.send(new ScreenRecordStopMessage())
    }
  }

  private async startRecord(): Promise<boolean> {
    const response = await fetch(`${this.backendLivekitUrl}/start-recording`, {
      method: 'POST',
      // eslint-disable-next-line
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: this.roomName }),
    })
    if (!response.ok) return false

    const data = await response.json()
    if (data.egressId === undefined) return false
    this.egressId = data.egressId

    return true
  }

  private async stopRecord(): Promise<boolean> {
    if (this.egressId === undefined) return false

    const response = await fetch(`${this.backendLivekitUrl}/stop-recording`, {
      method: 'POST',
      // eslint-disable-next-line
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: this.roomName, egressId: this.egressId }),
    })
    if (!response.ok) return false

    this.resetTimer()
    this.egressId = undefined

    return true
  }

  private setupTimer(): void {
    this.resetTimer()

    this.recordingTimer = setTimeout(() => {
      void this.stopRecord().then((result) => {
        if (result) {
          this.networkPluginStore.messageSender.send(new ScreenRecordStopMessage())
        }
      })
    }, this.maxRecordingDuration)
  }

  private resetTimer(): void {
    if (this.recordingTimer !== undefined) {
      clearTimeout(this.recordingTimer)
      this.recordingTimer = undefined
    }
  }
}
