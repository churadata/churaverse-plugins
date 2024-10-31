export interface IGame {
  readonly isActive: boolean
  start: (gameOwner: string) => Promise<void>
  end: () => void
  // abort: () => void
}
