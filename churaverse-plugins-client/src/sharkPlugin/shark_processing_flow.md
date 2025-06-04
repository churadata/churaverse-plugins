# サメ出現シーケンス図

```mermaid
sequenceDiagram
    participant ClientA as クライアントA（攻撃者）
    participant Server as ゲームサーバー
    participant ClientB as クライアントB（他プレイヤー）

    %% キー入力とクライアント側生成
    ClientA->>ClientA: sharkSpawn() でSharkインスタンス生成
    Note right of ClientA: registerKeyAction(shotshark,'Z',inGame,300)

    ClientA->>ClientA: eventBus.post(sharkSpawnEvent)
    Note right of ClientA: const shark = new Shark(id,pos,direction);

    %% クライアント→サーバーへ同期
    ClientA->>Server: socket.send("sharkSpawn", SharkSpawnMessage)
    ClientA->>ClientA: SharkRenderer がローカル描画

     %% ==== サーバー側：Shark 登録・他プレイヤーへ通知 ====
    Server->>Server: sharkSpawn(msg, senderId) のハンドラー実行


    Server->>Server: new Shark(...)
    Server->>Server: shark.move(遅延分)
      Note right of Server: const shark = new Shark(...);

    Server->>Server: eventBus.post(EntitySpawnEvent)
      Note right of Server: eventBus.post(new EntitySpawnEvent(shark, senderId));
      Note right of Server: sendMessage('sharkSpawn') を送信

    Server->>ClientB: broadcast 'sharkSpawn' (others)

    %% ==== クライアントB：Shark 受信・描画 ====
    ClientB->>ClientB: onMessage('sharkSpawn') を受信

    ClientB->>ClientB: eventBus.post(EntitySpawnEvent)
      Note right of ClientB: eventBus.post(new EntitySpawnEvent());

    ClientB->>ClientB: SharkRenderer が描画
    