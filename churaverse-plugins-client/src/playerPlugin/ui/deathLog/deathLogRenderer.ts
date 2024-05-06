import { FadeOutLogRenderer } from '@churaverse/core-ui-plugin-client/fadeOutLog/fadeOutLogRenderer'
import { IDeathLogRenderer, DeathLogMessageBuilder } from '../../interface/IDeathLogRenderer'
import { DeathLog } from './deathLog'
import { DamageCauseType } from 'churaverse-engine-client'

/**
 * デスログの表示
 */
export class DeathLogRenderer implements IDeathLogRenderer {
  private readonly deathLogMessageBuilders = new Map<DamageCauseType, DeathLogMessageBuilder>()
  public constructor(private readonly fadeOutLogRenderer: FadeOutLogRenderer) {}

  /**
   * デスログを追加する
   */
  public add(deathLog: DeathLog): void {
    const messageBuilder = this.deathLogMessageBuilders.get(deathLog.cause)
    if (messageBuilder !== undefined) {
      this.fadeOutLogRenderer.add(messageBuilder(deathLog))
    } else {
      this.fadeOutLogRenderer.add(`${deathLog.killer.name} が ${deathLog.victim.name} に勝利！`)
    }
  }

  /**
   * デスログ作成用の関数を各プラグインから deathLogBuildFuncs に対して追加する関数
   */
  public addDeathLogMessageBuilder(damageCause: DamageCauseType, callback: DeathLogMessageBuilder): void {
    this.deathLogMessageBuilders.set(damageCause, callback)
  }
}
