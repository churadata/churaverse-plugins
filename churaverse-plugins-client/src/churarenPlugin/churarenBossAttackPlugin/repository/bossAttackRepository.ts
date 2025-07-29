import { BossAttack } from '../domain/bossAttack'

/**
 * BossAttackのインスタンスを格納する場所
 */
export class BossAttackRepository {
  private readonly bossAttack = new Map<string, BossAttack>()

  public set(id: string, bossAttack: BossAttack): void {
    this.bossAttack.set(id, bossAttack)
  }

  public delete(id: string): void {
    this.bossAttack.delete(id)
  }

  public get(id: string): BossAttack | undefined {
    return this.bossAttack.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bossAttack.keys())
  }

  public get size(): number {
    return this.bossAttack.size
  }
}
