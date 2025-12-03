import { loadRnnoise, RnnoiseWorkletNode } from '@sapphi-red/web-noise-suppressor'
import rnnoiseWorkletUrl from '@sapphi-red/web-noise-suppressor/rnnoiseWorklet.js?url'
import rnnoiseWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise.wasm?url'
import rnnoiseSimdWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise_simd.wasm?url'

// RNNoise を利用してマイク音声を処理し、publish 用の MediaStreamTrack を返す
export class RnnoiseMicPipeline {
  private audioContext: AudioContext | undefined
  private destination: MediaStreamAudioDestinationNode | undefined
  private sourceStream: MediaStream | undefined
  private processedTrack: MediaStreamTrack | undefined
  private workletNode: RnnoiseWorkletNode | undefined

  private static wasmBinaryPromise: Promise<ArrayBuffer> | undefined

  public async start(): Promise<MediaStreamTrack> {
    if (this.processedTrack?.readyState === 'live') return this.processedTrack

    await this.stop()

    // なるべく緩い制約でマイク取得。失敗時は例外を投げる。
    this.sourceStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    this.audioContext = new AudioContext({ sampleRate: 48_000 })
    this.destination = this.audioContext.createMediaStreamDestination()

    await this.audioContext.audioWorklet.addModule(rnnoiseWorkletUrl)
    const wasmBinary = await RnnoiseMicPipeline.loadWasmBinary()
    this.workletNode = new RnnoiseWorkletNode(this.audioContext, { maxChannels: 1, wasmBinary })

    const sourceNode = this.audioContext.createMediaStreamSource(this.sourceStream)
    sourceNode.connect(this.workletNode).connect(this.destination)

    const [track] = this.destination.stream.getAudioTracks()
    if (track === undefined) {
      throw new Error('Failed to create RNNoise processed microphone track')
    }

    this.processedTrack = track
    ;(window as unknown as { __processedMicTrack?: MediaStreamTrack }).__processedMicTrack = track

    return track
  }

  public async stop(): Promise<void> {
    this.processedTrack?.stop()
    this.processedTrack = undefined

    this.sourceStream?.getTracks().forEach((t) => t.stop())
    this.sourceStream = undefined

    try {
      this.workletNode?.destroy()
      this.workletNode?.disconnect()
    } catch {
      // ignore
    }
    this.workletNode = undefined

    this.destination?.disconnect()
    this.destination = undefined

    if (this.audioContext !== undefined) {
      await this.audioContext.close()
    }
    this.audioContext = undefined
  }

  private static async loadWasmBinary(): Promise<ArrayBuffer> {
    if (this.wasmBinaryPromise === undefined) {
      this.wasmBinaryPromise = loadRnnoise({ url: rnnoiseWasmUrl, simdUrl: rnnoiseSimdWasmUrl })
    }
    return await this.wasmBinaryPromise
  }
}
