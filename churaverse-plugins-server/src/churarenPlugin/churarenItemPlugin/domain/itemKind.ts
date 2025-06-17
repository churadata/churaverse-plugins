export const itemKinds = ['fireOre', 'waterOre', 'grassOre', 'herb'] as const

export type ItemKind = typeof itemKinds[number]