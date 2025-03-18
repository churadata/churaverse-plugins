import { GameIds } from "@churaverse/game-plugin-server/interface/gameIds";

export interface IChurarenGameSequence {
  sequence: (gameId: GameIds) => Promise<void>
}
