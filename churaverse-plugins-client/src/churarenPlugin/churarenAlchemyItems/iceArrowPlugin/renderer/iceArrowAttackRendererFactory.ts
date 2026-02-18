import { Scene } from 'phaser'
import { IIceArrowAttackRendererFactory } from '../domain/IIceArrowAttackRendererFactory'
import { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import { IceArrowAttackRenderer } from './iceArrowAttackRenderer'

export class IceArrowAttackRendererFactory implements IIceArrowAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IIceArrowAttackRenderer {
    return new IceArrowAttackRenderer(this.scene)
  }
}
