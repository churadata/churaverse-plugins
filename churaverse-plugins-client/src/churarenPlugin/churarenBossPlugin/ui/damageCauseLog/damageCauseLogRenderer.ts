import { DamageCauseType } from 'churaverse-engine-client'
import { DamageCauseLogMessageBuilder, IDamageCauseLogRenderer } from '../../interface/IDamageCauseLogRenderer'
import { FadeOutLogRenderer } from '@churaverse/core-ui-plugin-client/fadeOutLog/fadeOutLogRenderer'
import { DamageCauseLog } from './damageCauseLog'

/**
 * ダメージ原因ログの表示
 */
export class DamageCauseLogRenderer implements IDamageCauseLogRenderer {
  private readonly damageCauseLogMessageBuilders = new Map<DamageCauseType, DamageCauseLogMessageBuilder>()
  public constructor(private readonly fadeOutLogRenderer: FadeOutLogRenderer) {}

  /**
   * ダメージ原因ログを追加する
   */
  public add(damageCauseLog: DamageCauseLog): void {
    const messageBuilder = this.damageCauseLogMessageBuilders.get(damageCauseLog.cause)
    if (messageBuilder !== undefined) {
      this.fadeOutLogRenderer.add(messageBuilder(damageCauseLog))
    } else {
      this.fadeOutLogRenderer.add(
        `${damageCauseLog.attacker.name} が ボス に ${damageCauseLog.damage} ダメージを与えた！`
      )
    }
  }

  /**
   * ダメージ原因ログ作成用の関数を各プラグインから damageCauseLogBuildFuncs に対して追加する関数
   */
  public addDamageCauseLogMessageBuilder(damageCause: DamageCauseType, callback: DamageCauseLogMessageBuilder): void {
    this.damageCauseLogMessageBuilders.set(damageCause, callback)
  }
}
