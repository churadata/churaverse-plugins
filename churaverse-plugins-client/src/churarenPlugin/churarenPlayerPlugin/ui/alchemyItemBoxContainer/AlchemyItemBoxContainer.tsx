import { createRoot, Root } from 'react-dom/client'
import { IAlchemyItemBoxContainer } from '../../interface/IAlchemyItemBoxContainer'
import { AlchemyItemBoxComponent } from './components/AlchemyItemBoxComponent'

export class AlchemyItemBoxContainer implements IAlchemyItemBoxContainer {
  private readonly alchemyItemBoxContainerId: string = 'alchemy-item-box-container'
  public element!: HTMLElement
  private root!: Root

  public initialize(): void {
    const gameDiv = document.getElementById('game')
    if (gameDiv === null) {
      throw new Error('gameDiv is null')
    }
    this.element = document.createElement('div')
    this.element.id = this.alchemyItemBoxContainerId
    gameDiv.appendChild(this.element)
    this.root = createRoot(this.element)
    this.updateAlchemyItemBox('')
  }

  public show(): void {
    this.element.style.display = 'flex'
  }

  public hide(): void {
    this.element.style.display = 'none'
  }

  public updateAlchemyItemBox(itemImage: string): void {
    if (this.element === undefined) return
    this.root.render(<AlchemyItemBoxComponent item={itemImage} />)
  }

  public remove(): void {
    this.element.style.display = 'none'
    this.root.unmount()
  }
}
