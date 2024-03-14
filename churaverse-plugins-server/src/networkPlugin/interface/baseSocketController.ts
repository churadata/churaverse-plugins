import { Scenes, IEventBus, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '../../networkPlugin/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '../../networkPlugin/event/registerMessageListenerEvent'

export abstract class BaseSocketController<Scene extends Scenes> {
  public constructor(protected readonly eventBus: IEventBus<Scene>, protected readonly store: Store<Scene>) {}

  public registerMessage(ev: RegisterMessageEvent<Scene>): void {}

  public registerMessageListener(ev: RegisterMessageListenerEvent<Scene>): void {}
}
