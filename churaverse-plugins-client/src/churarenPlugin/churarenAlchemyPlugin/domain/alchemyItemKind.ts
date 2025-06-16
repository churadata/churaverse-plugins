import { IAlchemyItemRenderer } from './IAlchemyItemRenderer'

export type AlchemyItemKind =
  | 'explosion'
  | 'flamePillar'
  | 'waterRing'
  | 'iceArrow'
  | 'trap'
  | 'blackHole'
  | 'revivalItem'
  | 'healingPotion'
export type AlchemyRenderer = IAlchemyItemRenderer

// 錬金ボックスのアイテムボックスの中での表示画像を定義
export const alchemyItemImage: Record<AlchemyItemKind, string> = {
  explosion: '',
  flamePillar: '',
  waterRing: '',
  iceArrow: '',
  trap: '',
  blackHole: '',
  revivalItem: '',
  healingPotion: '',
}
