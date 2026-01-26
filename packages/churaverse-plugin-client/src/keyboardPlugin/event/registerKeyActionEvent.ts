import { CVEvent, IMainScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import { IKeyActionRegister } from '../interface/IKeyActionRegister'

/**
 * KeyActionの登録を行うフェーズ
 */
export class RegisterKeyActionEvent<Scene extends Scenes> extends CVEvent<Scenes> {
  public constructor(public readonly keyActionRegister: IKeyActionRegister<Scene>) {
    super('registerKayAction', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    registerKayAction: RegisterKeyActionEvent<IMainScene>
  }
  export interface CVTitleEventMap {
    registerKayAction: RegisterKeyActionEvent<ITitleScene>
  }
}
