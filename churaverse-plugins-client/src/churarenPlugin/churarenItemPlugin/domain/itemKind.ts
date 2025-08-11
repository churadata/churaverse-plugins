export const ITEM_KINDS = ['fireOre', 'waterOre', 'grassOre', 'herb'] as const

/**
 * アイテムの種類
 */
export type ItemKind = (typeof ITEM_KINDS)[number]
