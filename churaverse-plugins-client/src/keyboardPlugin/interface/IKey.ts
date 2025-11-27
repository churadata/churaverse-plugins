export interface IKey {
  logicalUp: boolean
  duration: number
  keyCode: string
  isJustDown: boolean
  isDown: boolean
  isHold: boolean
  resetHoldTime: () => void
  updateHoldTime: (dt: number) => void
  logicalRelease: () => void
  onPhysicalKeyDown: () => void
}
