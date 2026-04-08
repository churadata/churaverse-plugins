import { RoomOptions, VideoPresets } from 'livekit-client'

export type LiveKitRoomProfileName = 'main' | 'meeting'

const profiles: Record<LiveKitRoomProfileName, RoomOptions> = {
  main: {
    // Phaserに映像を流す際にstreamがpause状態になるためfalse
    adaptiveStream: false,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: VideoPresets.h1080.resolution,
    },
  },
  meeting: {
    adaptiveStream: true,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: VideoPresets.h720.resolution,
    },
  },
}

export function getRoomOptions(profile: LiveKitRoomProfileName): RoomOptions {
  return profiles[profile]
}
