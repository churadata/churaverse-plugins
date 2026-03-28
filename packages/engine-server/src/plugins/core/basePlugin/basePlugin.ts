import { Store } from '../../../store/store'
import { Scenes } from '../../../scene/types'
import { IEventBus } from '../../../eventbus/IEventBus'

/**
 * constructor→loading→listenEventの順に実行される. 各pluginのloadingは非同期的に実行され, 全てのpluginのloadingが完了してからlistenEventが実行される
 */
export abstract class BasePlugin<Scene extends Scenes> {
  public constructor(
    protected readonly store: Store<Scene>,
    protected readonly bus: IEventBus<Scene>
  ) {}
  public async loading(): Promise<void> {}
  public abstract listenEvent(): void
}
