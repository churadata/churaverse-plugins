import { Scenes, IMainScene, ITitleScene } from 'churaverse-engine-server'
import { IMessageSender } from '../interface/IMessageSender'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    networkPlugin: NetworkPluginStore<IMainScene>
  }

  export interface StoreInTitle {
    networkPlugin: NetworkPluginStore<ITitleScene>
  }
}

export interface NetworkPluginStore<Scene extends Scenes> {
  readonly messageSender: IMessageSender<Scene>
}
