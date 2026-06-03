import { EgressClient, EncodedFileOutput } from 'livekit-server-sdk'
import { IEgressClient } from './IEgressClient'
import { LivekitConfigUndefinedError } from '../errors/livekitConfigUndefinedError'

export interface LivekitConnectionConfig {
  url: string
  apiKey: string
  apiSecret: string
  customBaseUrl?: string
}

export function createDefaultConfig(): LivekitConnectionConfig {
  const url = process.env.LIVEKIT_URL
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  const customBaseUrl = process.env.SCREEN_RECORD_TEMPLATE_URL

  if (url == null || apiKey == null || apiSecret == null) {
    throw new LivekitConfigUndefinedError()
  }

  return { url, apiKey, apiSecret, customBaseUrl }
}

export class ScreenRecordEgressClient implements IEgressClient {
  private readonly client: EgressClient
  private readonly customBaseUrl?: string

  public constructor(config: LivekitConnectionConfig) {
    this.client = new EgressClient(config.url, config.apiKey, config.apiSecret)
    this.customBaseUrl = config.customBaseUrl
  }

  public async start(roomName: string): Promise<{ egressId: string }> {
    const info = await this.client.startRoomCompositeEgress(
      roomName,
      new EncodedFileOutput({
        filepath: '/out/{room_name}-{time}.mp4',
      }),
      {
        // 標準テンプレート使用時のレイアウト指定
        layout: 'speaker',
        // 独自録画テンプレートの URL。未指定なら LiveKit 標準テンプレートを使用
        customBaseUrl: this.customBaseUrl,
      }
    )
    return { egressId: info.egressId }
  }

  public async stop(egressId: string): Promise<void> {
    await this.client.stopEgress(egressId)
  }
}
