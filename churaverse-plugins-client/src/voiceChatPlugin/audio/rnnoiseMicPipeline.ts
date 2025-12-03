import { loadRnnoise, RnnoiseWorkletNode } from '@sapphi-red/web-noise-suppressor'
import rnnoiseWorkletUrl from '@sapphi-red/web-noise-suppressor/rnnoiseWorklet.js?url'
import rnnoiseWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise.wasm?url'
import rnnoiseSimdWasmUrl from '@sapphi-red/web-noise-suppressor/rnnoise_simd.wasm?url'

/**
 * RNNoise ベースのマイク用パイプライン.
 *
 * 責務:
 * - getUserMedia でローカルのマイクストリームを取得する
 * - AudioContext / AudioWorklet (RnnoiseWorkletNode) を通してノイズ抑圧を行う
 * - LiveKit に publish 可能な MediaStreamTrack を返す
 *
 * このクラスは「音声処理」に専念し、LiveKit との連携は VoiceChatSender 側に任せる。
 */
export class RnnoiseMicPipeline {
  private audioContext: AudioContext | undefined
  private destination: MediaStreamAudioDestinationNode | undefined
  private sourceStream: MediaStream | undefined
  private processedTrack: MediaStreamTrack | undefined
  private workletNode: RnnoiseWorkletNode | undefined

  private static wasmBinaryPromise: Promise<ArrayBuffer> | undefined

  public async start(): Promise<MediaStreamTrack> {
    // 既に有効なトラックがある場合は再利用する
    if (this.processedTrack?.readyState === 'live') return this.processedTrack

    await this.stop()

    // なるべく緩い制約でマイク取得。
    // 一部環境で厳しすぎる制約を指定すると OverconstrainedError が発生するため、
    // 基本は { audio: true } とし、失敗時は上位の呼び出し側でフォールバックする。
    this.sourceStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    this.audioContext = new AudioContext({ sampleRate: 48_000 })
    this.destination = this.audioContext.createMediaStreamDestination()

    // RNNoise の AudioWorklet をロードして処理ノードを生成
    await this.audioContext.audioWorklet.addModule(rnnoiseWorkletUrl)
    const wasmBinary = await RnnoiseMicPipeline.loadWasmBinary()
    this.workletNode = new RnnoiseWorkletNode(this.audioContext, { maxChannels: 1, wasmBinary })

    // getUserMedia のストリームを AudioContext に接続し、RNNoise 経由で destination へ流す
    const sourceNode = this.audioContext.createMediaStreamSource(this.sourceStream)
    sourceNode.connect(this.workletNode).connect(this.destination)

    const [track] = this.destination.stream.getAudioTracks()
    if (track === undefined) {
      // AudioWorklet 経由のストリームが取得できなかった場合は上位でフォールバックさせる
      throw new Error('Failed to create RNNoise processed microphone track')
    }

    // LiveKit 側で publish する MediaStreamTrack を保持
    this.processedTrack = track
    // デバッグ用: ブラウザ上で getSettings() を確認できるようにグローバルに公開
    ;(window as unknown as { __processedMicTrack?: MediaStreamTrack }).__processedMicTrack = track

    return track
  }

  public async stop(): Promise<void> {
    // publish していたトラックを停止
    this.processedTrack?.stop()
    this.processedTrack = undefined

    // getUserMedia で取得した元のストリームも全て停止
    this.sourceStream?.getTracks().forEach((t) => t.stop())
    this.sourceStream = undefined

    try {
      // RNNoise の内部リソースを解放
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
    // wasm バイナリは static にキャッシュし、複数回の start() 呼び出しで再利用する
    if (this.wasmBinaryPromise === undefined) {
      this.wasmBinaryPromise = loadRnnoise({ url: rnnoiseWasmUrl, simdUrl: rnnoiseSimdWasmUrl })
    }
    return await this.wasmBinaryPromise
  }
}
