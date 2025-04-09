import { Position } from 'churaverse-engine-server'
/**
 * 画面内のランダムな位置を取得する
 */
export function getRandomPosition(maxX: number, maxY: number): Position {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY)
  return new Position(x, y)
}
