

# ボイスチャット音声パイプライン改修レポート

## 概要（今回のリファクタで伝えたいこと）

1. 音声パイプラインは送受信ともに Web Audio Node ベースへ全面移行し、契約（定義）と実装を分離。実装を差し替えるだけで各種処理を容易に導入でき、Web Audio を採用したことで既存の音声処理ライブラリを無痛で組み込める。将来的には UI から音声効果を切り替える（例：声質変換）といった拡張も実現しやすい。

2. 以前のノイズ処理 PR も、今回のリファクタを土台に、ライブラリの推奨手順でノイズ抑制ノードを挿入する形に置き換えられる。これにより、従来の苦しい実装を避け、きれいに効果を組み込める。実習終了につき、後続の先輩に引き継ぎをお願いしたい。https://github.com/churadata/churaverse-plugins/pull/92
https://github.com/churadata/churaverse_private/pull/403

3. 第1・第2コミットで送受信の Web Audio 化を完了し、テストも通過済み。第3コミットでリソース解放用スイッチ（dispose）を用意したが、現状は未接続の予備。詳細は**手動解放スイッチ**の項を参照。

## 何が問題だったか
- LiveKit の RemoteTrack を直接 `<audio>` に attach し、距離減衰も `<audio>.volume` を直叩き。処理ノードを挟めず、EQ/録音/空間化/分析などを入れるたびに大改修が必要だった。
- 送信前の加工入口がなく、降噪/耳返し/録音を柔軟に挿せない。
- 上位ロジックが LiveKit / `<audio>` に強く依存していて差し替えが困難。
- リソース解放がバラバラで、長時間稼働や入退室を繰り返すと hidden `<audio>` や Web Audio ノードが残留する懸念。

## 今回の解決方針
- 上位は「誰の音量をどうする」「マイク ON/OFF」だけを契約 (`IAudioService`) 経由で指示し、LiveKit/HTML の詳細は触らない。
- 下位は Web Audio を核に送受信チェーンを一元管理し、効果挿入や録音を行いやすい音声グラフを用意。
- リソース解放用の手動スイッチ `dispose()` を先行実装。現状は自動で呼ばないが、将来のルーム/Lifecycle リファクタ時（同時接続増・パフォーマンス改善のタイミング）に正しい離脱イベントへ結線できるようにする。

## 実装ハイライト
- **契約層** `IAudioService`  
  - `unlock / addRemoteTrack / removeRemoteTrack / setRemoteVolume / startLocalMic / stopLocalMic / dispose` を定義。
  - その他の操作／機能を追加する必要がある場合は、ここに定義できます。
- **受信チェーン**  
  - track.source が Unknown でも `track.kind === audio` なら受信。  
  - 隠し `<audio>` に attach → `MediaElementSource -> Gain -> destination` で Web Audio グラフへ。  
  - 距離減衰・音量操作は Gain 経由で実施。
  - 受信側の機能実装についても、同様に各種機能を柔軟に追加可能です。
- **送信チェーン**  
  - `getUserMedia -> MediaStreamSource -> Gain -> MediaStreamDestination -> publishTrack`。  
  - AudioContext が動かない場合は raw publish にフォールバックし無音を回避。  
  - デバッグで `mode: web-audio/raw` を確認可能。
  - 送信側の機能実装については、ノイズ抑制や波形表示などの機能を容易に組み込める構成になっています。
- **手動解放スイッチ** `dispose()`  
  - 送受信チェーン断開、hidden `<audio>` detach/remove、AudioContext close を一括実行。  
  - 現時点ではライフサイクル管理が未完全なため、ローカル側の一部リソースが完全に解放されない可能性があります。
多数のユーザーが利用する場合や、ルームへの入退室を繰り返した場合に蓄積する恐れはありますが、あくまでローカルリソースに限定されるため、サーバーへの影響はなく、現状では影響は限定的と考えています。
 - 現状の room を含むゲーム側の仕組みと整合しない状態で無理に有効化すると、オーディオパイプラインが正常に機能しなくなるため、現時点では実際には使用せず、将来的なリファクタリング時に活用することを想定しています。



## 変更ファイル
- 新規: `src/voiceChatPlugin/domain/IAudioService.ts`
- 新規: `src/voiceChatPlugin/service/audioPipelineService.ts`
- 変更: `src/voiceChatPlugin/voiceChatReceiver.ts`
- 変更: `src/voiceChatPlugin/voiceChatSender.ts`
- 変更: `src/voiceChatPlugin/voiceChatVolumeController.ts`
- 変更: `src/voiceChatPlugin/voiceChatPlugin.ts`
- 変更: `src/voiceChatPlugin/event/joinVoiceChatEvent.ts`
