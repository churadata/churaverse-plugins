# gamePluginのクラス図

一般的なUML図の表記に基づいている。

```mermaid
classDiagram
    BasePlugin <|-- BaseGamePlugin
    BaseGamePlugin <|-- CoreGamePlugin
    IGameInfo <|.. CoreGamePlugin
    CoreGamePlugin *-- GameJoinManager
    IGameJoinManager <|.. GameJoinManager

    class BasePlugin {
        <<abstract>>
        #store: Store<Scene>
        #bus: IEventBus<Scene>

        listenEvent() void *
    }

    class IGameInfo {
        <<interface>>
        gameId: GameIds
        isActive: boolean
        ownerId: string | undefined
        joinedPlayerIds: string[]
        gameState: GameState
        gamePolicy: GamePolicy
    }

    class BaseGamePlugin {
        <<abstract>>
        gameId: GameIds * 
        +isActive: boolean

        #subscribeGameEvent() void
        #unsubscribeGameEvent() void
        handleGameStart() void *
        handleGameTermination() void *
    }

    class CoreGamePlugin {
        <<abstract>>
        gameId: GameIds *
        gamePolicy: GamePolicy *
        -gameJoinManager: IGameJoinManager

        #subscribeGameEvent() void
        #unsubscribeGameEvent() void
        handlePlayerLeave(playerId: string) void *
        handlePlayerQuitGame(playerId: string) void *
    }

    class GameJoinManager {
        - allPlayers Set~string~
        - joinedPlayers Set~string~
        - respondedPlayers Set~string~
    }

    class IGameJoinManager {
        <<interface>>
        
        +init(allPlayers: string[]) void
        +set(playerId: string, willJoin: boolean) void
        +delete(playerId: string) boolean
        +getJoinedPlayerIds() string[]
        +isAllPlayerResponse() boolean
        +clear() void
        +timeoutResponse() void
        +midwayJoinPlayer(playerId: string) void
    }
```


## 表記について
|表記|意味|
|---|---|
|*斜体*|抽象関数 or 抽象プロパティ|
|+|public|
|-|private|
|#|protected|