import { IScreenRecorder } from './interface/IScreenRecorder'

export class ScreenRecorder implements IScreenRecorder {
  private readonly roomName = 'room1'

  public async checkRecordingStatus(): Promise<boolean> {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_LIVEKIT_URL ?? 'http://localhost:8080/backend_livekit'}/recording-status?roomName=${this.roomName}`,
      {
        method: 'GET',
        // eslint-disable-next-line
        headers: { 'Content-Type': 'application/json' },
      }
    )
    if (!response.ok) return false

    const data = await response.json()
    if (data.isRecording === undefined) return false

    return data.isRecording
  }
}
