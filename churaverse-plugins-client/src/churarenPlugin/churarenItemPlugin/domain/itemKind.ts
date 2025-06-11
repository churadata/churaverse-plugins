import fireOreImage from '../assets/fireOre.png'
import waterOreImage from '../assets/waterOre.png'
import grassOreImage from '../assets/grassOre.png'
import herbImage from '../assets/herb.png'

export const itemKinds = ['fireOre', 'waterOre', 'grassOre', 'herb'] as const

/**
 * アイテムの種類
 */
export type ItemKind = (typeof itemKinds)[number]

export const materialItemImage: Record<ItemKind, string> = {
  fireOre: fireOreImage,
  waterOre: waterOreImage,
  grassOre: grassOreImage,
  herb: herbImage,
}
