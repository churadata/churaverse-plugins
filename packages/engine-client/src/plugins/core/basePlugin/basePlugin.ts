import { Store } from '../../../store/store'
import { Scenes } from '../../../scene/types'
import { IEventBus } from '../../../eventbus/IEventBus'

export abstract class BasePlugin<Scene extends Scenes> {
  public constructor(
    protected readonly store: Store<Scene>,
    protected readonly bus: IEventBus<Scene>,
    protected readonly sceneName: Scene['sceneName']
  ) {}
  public abstract listenEvent(): void
}
