import { IEventBus, Scenes, Store } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '../event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '../event/registerMessageListenerEvent'

export abstract class BaseSocketController<Scene extends Scenes> {
  public constructor(protected readonly eventBus: IEventBus<Scene>, protected readonly store: Store<Scene>) {}

  public registerMessage(ev: RegisterMessageEvent<Scene>): void {}

  public registerMessageListener(ev: RegisterMessageListenerEvent<Scene>): void {}
}
