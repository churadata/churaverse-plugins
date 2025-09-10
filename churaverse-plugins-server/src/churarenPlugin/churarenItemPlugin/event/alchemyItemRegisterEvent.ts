import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { IAlchemyItemRegister } from '../interface/IAlchemyItemRegister'

export class AlchemyItemRegisterEvent extends CVEvent<IMainScene> {
  public constructor(public readonly register: IAlchemyItemRegister) {
    super('alchemyItemRegister', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    alchemyItemRegister: AlchemyItemRegisterEvent
  }
}
