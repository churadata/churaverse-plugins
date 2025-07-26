import { ITrapRepository } from './ITrapRepository'

/**
 * トラップを削除する
 */
export function removeDieTrap(traps: ITrapRepository, trapId: string): void {
  traps.delete(trapId)
}
