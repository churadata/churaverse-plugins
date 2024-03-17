import { DomManager, IEventBus, IMainScene } from 'churaverse-engine-client'
import { DumpDebugDataEvent } from '../event/dumpDebugDataEvent'
import { DataDumper } from './dataDumper'
import { DebugScreenDumpButtonComponent } from './components/DebugScreenDumpButtonComponent'

/**
 * キーバインドフォームを開くボタン要素のid
 */
export const DEBUG_SCREEN_DUMP_BUTTON_ID = 'debugScreen-dump-button'

export class DebugScreenDumpButton {
  public buttonElement: HTMLElement

  public constructor(private readonly eventBus: IEventBus<IMainScene>) {
    this.buttonElement = DomManager.jsxToDom(DebugScreenDumpButtonComponent())
    this.buttonElement.onclick = () => {
      this.dump()
    }
  }

  public dump(): void {
    this.eventBus.post(new DumpDebugDataEvent(new DataDumper()))
  }
}
