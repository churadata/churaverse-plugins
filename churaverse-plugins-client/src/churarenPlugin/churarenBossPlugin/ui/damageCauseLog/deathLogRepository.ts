import { DamageCauseLog } from './damageCauseLog'

export class DamageCauseLogRepository {
  private readonly damageCauseLogs: DamageCauseLog[] = []

  public addDamageCauseLog(damageCauseLog: DamageCauseLog): void {
    this.damageCauseLogs.push(damageCauseLog)
  }

  public allDamageCauseLogs(): DamageCauseLog[] {
    return [...this.damageCauseLogs]
  }
}
