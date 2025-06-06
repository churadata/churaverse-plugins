import { Flare } from '../domain/flare'

/**
 * Sharkのインスタンスを格納する場所
 */
export class FlareRepository {
  private readonly flares = new Map<string, Flare>()

  public set(id: string, flare: Flare): void {
    this.flares.set(id, flare)
  }

  public delete(id: string): void {
    this.flares.delete(id)
  }

  public get(id: string): Flare | undefined {
    return this.flares.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.flares.keys())
  }

  public get size(): number {
    return this.flares.size
  }
}
