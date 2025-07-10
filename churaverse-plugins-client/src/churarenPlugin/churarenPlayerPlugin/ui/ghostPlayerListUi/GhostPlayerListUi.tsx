import { Root, createRoot } from 'react-dom/client'
import { IGhostPlayerListUi } from '../../interface/IGhostPlayerListUi'
import { GhostPlayerListComponent } from './components/GhostPlayerListComponent'
import { IMainScene, Store } from 'churaverse-engine-client'

export class GhostPlayerListUi implements IGhostPlayerListUi {
  private readonly ghostPlayerListContainerId = 'churaren-game-ghost-player-list'
  private element!: HTMLElement
  private root!: Root

  public constructor(private readonly store: Store<IMainScene>) {}

  public initialize(): void {
    const gameDiv = document.getElementById('game')
    if (gameDiv === null) {
      throw new Error('gameDiv is null')
    }
    this.element = document.createElement('div')
    this.element.id = this.ghostPlayerListContainerId
    gameDiv.appendChild(this.element)
    this.root = createRoot(this.element)
    this.show()
  }

  public show(): void {
    this.element.style.display = 'flex'
  }

  public updateGhostPlayerList(playerNames: string[]): void {
    if (this.element === undefined) return
    this.root.render(<GhostPlayerListComponent playerNames={playerNames} />)
  }

  public remove(): void {
    this.element.style.display = 'none'
    this.root.unmount()
  }
}
