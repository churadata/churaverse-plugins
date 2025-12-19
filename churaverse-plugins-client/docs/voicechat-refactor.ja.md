# ボイスチャット音声パイプライン改修レポート（日本語）

## 背景
- ノイズ抑制導入を急いだ結果、LiveKit の RemoteTrack をそのまま `<audio>` に attach し、距離減衰は `<audio>.volume` を直接操作していた。処理ノードを挿し込む余地がなく、EQ/録音/空間化/分析などを追加するには大規模な書き換えが必要だった。

## 目的
- 上位層は「誰が来た/去った」「音量」「マイクやメガホンの状態」だけを表明し、`<audio>` や LiveKit の細部には触れない。
- 音声処理・ライフサイクル（遠端再生チェーン、将来の送信チェーン）を一箇所で管理し、効果挿入やデバッグが容易な音声グラフを提供する。
- デバイス切替やリソース解放の抜け漏れを防ぎ、今後の機能追加コストを下げる。

## 変更概要
- **契約層**：`IAudioService` を新設し、`unlock` / `addRemoteTrack` / `removeRemoteTrack` / `setRemoteVolume` に加えローカル送信 `startLocalMic/stopLocalMic` も含めて統一。
- **実装層**：`AudioPipelineService` を追加。RemoteAudioTrack を隠し `<audio>` に attach し、`MediaElementSource -> Gain -> destination` の Web Audio グラフで再生・音量制御。ActiveDeviceChanged に応じて `setSinkId` を試行。ローカル送信も Web Audio 経由（動かない場合は raw publish にフォールバックして無音を回避）。
- **接線**：Receiver は RemoteAudioTrack を直接 AudioService に渡し（source Unknown も受ける）、VolumeController は AudioService 経由で音量を指示。Sender は AudioService の送信チェーンを優先し、Plugin は定期距離減衰のタイマー管理と起動時 `unlock()` を実施。

## 詳細な実施内容
1. **IAudioService 追加**  
   - `domain/IAudioService.ts` を作成。上位はこの契約のみを見るため、実装を差し替えても UI/イベント層への影響を最小化できる。
2. **AudioPipelineService 実装**  
   - `service/audioPipelineService.ts` で Web Audio グラフを構築。  
     - AudioContext を遅延生成し、Room の ActiveDeviceChanged（audiooutput）にフックして `setSinkId` を試行。  
     - 互換性重視で `track.attach(隠し <audio>)` を入口にし、`MediaElementSource -> Gain -> destination` で後段処理を集約。  
     - ローカル送信：`getUserMedia -> MediaStreamSource -> Gain -> MediaStreamDestination -> publishTrack`。AudioContext が走らない場合は raw track publish へフォールバックし、無音を防止。既存マイクは unpublish 後に差し替え。  
     - `unlock()` は `AudioContext.resume()` と `room.startAudio()`、隠し `<audio>.play()` を併用し、autoplay 制限下の復帰率を向上。  
     - `remoteChains`/`localChain` でノード・DOM を一元管理し、切断時に detach/remove/stop を確実に行う。  
     - `localStorage.__CV_DEBUG_AUDIO__ = "true"` でデバッグログを有効化。送信チェーン作成時に `mode: web-audio/raw` を出力。
3. **上位ロジックの付け替え**  
   - `voiceChatReceiver.ts`：音声 track.kind=audio で受信（source Unknown も許可）し、RemoteAudioTrack を AudioService に登録。  
   - `voiceChatVolumeController.ts`：メガホン状態のみ保持し、距離減衰後に `audioService.setRemoteVolume()` を発行。HTMLAudioElement 依存を排除。  
   - `voiceChatSender.ts`：マイクの on/off は `audioService.startLocalMic/stopLocalMic` を優先、未提供時は従来の `setMicrophoneEnabled` にフォールバック。  
   - `voiceChatPlugin.ts`：AudioPipelineService を生成して Receiver/Sender/Controller に渡す。音量更新タイマーを再利用可能にし、開始時に `unlock()` を試みて自動再生制限を緩和。
4. **イベント**  
   - `JoinVoiceChatEvent` のペイロードを playerId のみに簡素化（プロジェクト内に他利用なし）。イベント自体は残し、将来の拡張に備える。

## 影響・リスク
- 音量挙動は従来と同等（初期 Gain=1、距離減衰しきい値 400、二次減衰曲線）。  
- `unlock()` はユーザー操作が絡まないと失敗するブラウザがあるため、UI 側での再呼び出し導線が望ましい。  
- `setSinkId` は非対応環境では no-op。対応ブラウザでは LiveKit のスピーカー切替と同期。  
- MediaStreamTrack の stop は SDK に委ねており、再購読シナリオを阻害しないようにしている。

## 今後の提案
- 送信チェーン（getUserMedia -> 処理 -> publish）にも AudioService を適用し、耳返し・録音・降噪切替・レベルメータを実装可能にする。  
- 距離減衰のパラメータを設定化し、ゲームデザインに合わせたチューニングを容易にする。  
- RemoteTrack モックを用いた最小限のユニット/統合テストで add/remove/volume を検証。  
- UI に「クリックで音声を有効化」等の案内を追加し、ユーザー操作で確実に `unlock()` を呼べる導線を整える。

## 変更ファイル
- 新規: `src/voiceChatPlugin/domain/IAudioService.ts`  
- 新規: `src/voiceChatPlugin/service/audioPipelineService.ts`  
- 変更: `src/voiceChatPlugin/voiceChatReceiver.ts`  
- 変更: `src/voiceChatPlugin/voiceChatVolumeController.ts`  
- 変更: `src/voiceChatPlugin/voiceChatPlugin.ts`  
- 変更: `src/voiceChatPlugin/event/joinVoiceChatEvent.ts`
