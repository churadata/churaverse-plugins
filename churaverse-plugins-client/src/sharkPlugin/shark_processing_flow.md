# サメ出現シーケンス図

```mermaid
sequenceDiagram
    participant AttackUser as 攻撃ユーザー
    participant ClientA as クライアントA（攻撃者）
    participant Server as ゲームサーバー
    participant ClientB as クライアントB（他プレイヤー）

    %% キー入力とクライアント側生成
    AttackUser->>ClientA: Zキー押下（ShotShark）
    ClientA->>ClientA: sharkSpawn() でSharkインスタンス生成
    ClientA->>ClientA: eventBus.post(sharkSpawnEvent)

    %% クライアント→サーバーへ同期
    ClientA->>Server: socket.send("sharkSpawn", SharkSpawnMessage)
    ClientA->>ClientA: SharkRenderer がローカル描画

    %% サーバー側処理
    Server->>Server: sharkSpawn(msg, senderId)
    Server->>Server: new Shark(...)
    Server->>Server: shark.move(遅延分)
    Server->>Server: eventBus.post(EntitySpawnEvent)
    Server->>ClientB: broadcast 'sharkSpawn' (others)

    %% 他プレイヤー側処理
    ClientB->>ClientB: onMessage('sharkSpawn')
    ClientB->>ClientB: eventBus.post(EntitySpawnEvent)
    ClientB->>ClientB: SharkRenderer が描画
