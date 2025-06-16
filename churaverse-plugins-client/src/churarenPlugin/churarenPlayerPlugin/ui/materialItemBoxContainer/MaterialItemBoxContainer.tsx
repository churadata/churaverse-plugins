import { Root, createRoot } from 'react-dom/client'
import { MaterialItemBoxComponent } from './components/MaterialItemBoxComponent'
import { IMaterialItemBoxContainer } from '../../interface/IMaterialItemBoxContainer'

export class MaterialItemBoxContainer implements IMaterialItemBoxContainer {
  private readonly materialItemBoxContainerId = 'material-item-box-container'
  public element!: HTMLElement
  private root!: Root

  public initialize(): void {
    const gameDiv = document.getElementById('game')
    if (gameDiv === null) {
      throw new Error('gameDiv is null')
    }
    this.element = document.createElement('div')
    this.element.id = this.materialItemBoxContainerId
    gameDiv.appendChild(this.element)
    this.root = createRoot(this.element)
    this.updateMaterialItemBox([])
  }

  public show(): void {
    this.element.style.display = 'flex'
  }

  public hide(): void {
    this.element.style.display = 'none'
  }

  public updateMaterialItemBox(itemImageList: string[]): void {
    if (this.element === undefined) return
    this.root.render(<MaterialItemBoxComponent itemImagePaths={itemImageList} />)
  }

  public remove(): void {
    this.element.style.display = 'none'
    this.root.unmount()
  }
}
