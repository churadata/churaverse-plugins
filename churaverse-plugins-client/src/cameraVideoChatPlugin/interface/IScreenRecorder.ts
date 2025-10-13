export interface IScreenRecorder {
  checkRecordingStatus: (roomName: string) => Promise<boolean>
}
