import { RemoteAudioTrack, Room, RoomEvent } from 'livekit-client'
import { IAudioService } from '../domain/IAudioService'

type RemoteChain = {
  audioEl?: HTMLAudioElement
  track: RemoteAudioTrack
  inputTrack: MediaStreamTrack
  source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode
  gain: GainNode
}

/**
 * Web Audio を用いた音声パイプラインの実装。
 * - 受信チェーンを Web Audio 化し、GainNode で音量制御を一元化
 * - Room のデバイス変更（audiooutput）に追従
 * - 将来のエフェクト挿入・録音等の拡張ポイントとなる
 */
export class AudioPipelineService implements IAudioService {
  private context?: AudioContext
  private readonly remoteChains = new Map<string, RemoteChain>()

  public constructor(private readonly room?: Room) {
    // 出力デバイスの切り替えを捕捉して AudioContext に同期させる
    if (this.room !== undefined) {
      this.room.on(RoomEvent.ActiveDeviceChanged, (kind: MediaDeviceKind, deviceId: string) => {
        if (kind !== 'audiooutput') return
        void this.applyOutputDevice(deviceId)
      })
    }
  }

  /**
   * デバッグログの有効判定。localStorage にフラグを置く簡易トグル。
   */
  private isDebugEnabled(): boolean {
    if (typeof window === 'undefined') return false
    const w = window as Window & { __CV_DEBUG_AUDIO__?: boolean }
    if (w.__CV_DEBUG_AUDIO__ === true) return true
    try {
      return (
        window.localStorage.getItem('__CV_DEBUG_AUDIO__') === 'true' ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.localStorage as any).__CV_DEBUG_AUDIO__ === 'true'
      )
    } catch {
      return false
    }
  }

  private debug(...args: unknown[]): void {
    if (!this.isDebugEnabled()) return
    // eslint-disable-next-line no-console
    console.log('[voiceChat][audio]', ...args)
  }

  /**
   * AudioContext を遅延生成し、既存のコンテキストを再利用する。
   */
  private getOrCreateContext(): AudioContext {
    if (this.context === undefined) {
      this.context = new AudioContext()
      this.debug('AudioContext created', { state: this.context.state })

      // 生成直後に現在の出力デバイス設定を同期
      if (this.room !== undefined) {
        const currentDevice =
          this.room.getActiveDevice('audiooutput') ?? this.room.getActiveAudioOutputDevice()
        if (currentDevice && currentDevice.length > 0) {
          void this.applyOutputDevice(currentDevice)
        }
      }
    }
    return this.context
  }

  /**
   * setSinkId が利用可能な環境では、AudioContext の出力デバイスを指定する。
   */
  private async applyOutputDevice(deviceId: string): Promise<void> {
    const ctx = this.getOrCreateContext()
    const ctxWithSink = ctx as AudioContext & { setSinkId?: (sinkId: string) => Promise<void> }
    if (typeof ctxWithSink.setSinkId !== 'function') {
      this.debug('AudioContext.setSinkId not supported', { deviceId })
      return
    }

    try {
      await ctxWithSink.setSinkId(deviceId)
      this.debug('AudioContext sink set', { deviceId })
    } catch (error) {
      this.debug('AudioContext.setSinkId failed', { deviceId, error: String(error) })
    }
  }

  /**
   * AudioContext が suspend されている場合に resume を試みる。
   */
  private async ensureRunning(ctx: AudioContext): Promise<void> {
    if (ctx.state === 'running') return
    try {
      this.debug('AudioContext resume requested', { state: ctx.state })
      await ctx.resume()
      this.debug('AudioContext resume done', { state: ctx.state })
    } catch (error) {
      // Autoplay 制限等で失敗しても、ユーザー操作を契機に再度呼び出される想定
      this.debug('AudioContext resume failed', { state: ctx.state, error: String(error) })
    }
  }

  /**
   * ブラウザの自動再生制限を解除するため、ユーザー操作起点で呼ぶ。
   * AudioContext の resume と room.startAudio() を併用して復帰率を高める。
   */
  public async unlock(): Promise<void> {
    const ctx = this.getOrCreateContext()
    await this.ensureRunning(ctx)

    const anyRoom = this.room as Room & { startAudio?: () => Promise<void> }
    if (anyRoom && typeof anyRoom.startAudio === 'function') {
      try {
        await anyRoom.startAudio()
        this.debug('room.startAudio done')
      } catch (error) {
        this.debug('room.startAudio failed', { error: String(error) })
      }
    }

    // 隠し audio 要素にも play を投げてデコードを開始させる
    for (const chain of this.remoteChains.values()) {
      if (chain.audioEl === undefined) continue
      try {
        await chain.audioEl.play()
        this.debug('audioEl.play done')
      } catch (error) {
        this.debug('audioEl.play failed', { error: String(error) })
      }
    }
  }

  /**
   * 遠隔プレイヤーのトラックを Web Audio グラフに接続する。
   */
  public addRemoteTrack(playerId: string, track: RemoteAudioTrack): void {
    // 再接続・再購読などのケースでは既存チェーンを置き換える
    this.removeRemoteTrack(playerId)

    const ctx = this.getOrCreateContext()
    void this.ensureRunning(ctx)

    const mediaStreamTrack = track.mediaStreamTrack
    this.debug('addRemoteTrack', {
      playerId,
      ctxState: ctx.state,
      readyState: mediaStreamTrack?.readyState,
      enabled: mediaStreamTrack?.enabled,
    })

    if (mediaStreamTrack == null) {
      this.debug('addRemoteTrack aborted: mediaStreamTrack missing', { playerId })
      return
    }

    if (mediaStreamTrack.enabled === false) {
      mediaStreamTrack.enabled = true
    }

    /**
     * パス: track.attach(隠し <audio>) -> MediaElementSource -> Gain -> destination
     * - attach 経由にすることで LiveKit/ブラウザのデコードや autoplay 解放の互換性を確保
     * - 処理ノードは Gain を起点に後から差し込み可能
     */
    let audioEl: HTMLAudioElement | undefined
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      audioEl = document.createElement('audio')
      audioEl.autoplay = true
      audioEl.setAttribute('playsinline', 'true')
      audioEl.setAttribute('webkit-playsinline', 'true')
      audioEl.controls = false
      audioEl.style.position = 'fixed'
      audioEl.style.left = '-9999px'
      audioEl.style.width = '1px'
      audioEl.style.height = '1px'
      audioEl.style.opacity = '0'
      audioEl.style.pointerEvents = 'none'
      document.body.appendChild(audioEl)
      track.attach(audioEl)
    }

    const source =
      audioEl !== undefined
        ? ctx.createMediaElementSource(audioEl)
        : ctx.createMediaStreamSource(new MediaStream([mediaStreamTrack]))
    const gain = ctx.createGain()

    source.connect(gain).connect(ctx.destination)

    const chain: RemoteChain = { audioEl, track, inputTrack: mediaStreamTrack, source, gain }
    this.remoteChains.set(playerId, chain)
    this.debug('remote chain created', { playerId, remoteChains: this.remoteChains.size })
  }

  /**
   * 遠隔プレイヤーのチェーンを破棄する。
   */
  public removeRemoteTrack(playerId: string): void {
    const chain = this.remoteChains.get(playerId)
    if (chain === undefined) return

    try {
      chain.source.disconnect()
    } catch {
      // ignore
    }

    try {
      chain.gain.disconnect()
    } catch {
      // ignore
    }

    try {
      if (chain.track && chain.audioEl) {
        chain.track.detach(chain.audioEl)
      }
    } catch {
      // ignore
    }

    try {
      if (chain.audioEl) {
        chain.audioEl.srcObject = null
        chain.audioEl.remove()
      }
    } catch {
      // ignore
    }

    // MediaStreamTrack の stop は LiveKit 側のライフサイクルに任せる
    this.remoteChains.delete(playerId)
    this.debug('remote chain removed', { playerId, remoteChains: this.remoteChains.size })
  }

  /**
   * プレイヤー個別の音量を GainNode 経由で設定。
   */
  public setRemoteVolume(playerId: string, volume: number): void {
    const chain = this.remoteChains.get(playerId)
    if (chain === undefined) return

    const ctx = this.getOrCreateContext()
    void this.ensureRunning(ctx)

    const clamped = Math.max(0, Math.min(1, volume))
    chain.gain.gain.value = clamped
    this.debug('setRemoteVolume', { playerId, volume: clamped, ctxState: ctx.state })
  }
}
