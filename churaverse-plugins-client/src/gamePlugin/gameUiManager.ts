import { GameIds } from './interface/gameIds'
import { GameUiRegister } from './gameUiRegister'

export class GameUiManager {
  private readonly gameUiRegister!: GameUiRegister

  public constructor(gameUiRegister: GameUiRegister) {
    this.gameUiRegister = gameUiRegister
  }

  public createGameUisComponent(gameId: GameIds): void {
    const components = this.gameUiRegister.getRegistered(gameId)
    components.forEach((component) => {
      component.initialize()
      if (!component.visible) {
        component.element.style.display = 'none'
      }
    })
  }

  public deleteGameUisComponent(gameId: GameIds): void {
    const components = this.gameUiRegister.getRegistered(gameId)
    components.forEach((component) => {
      component.delete()
      component.element.remove()
    })
  }
}
