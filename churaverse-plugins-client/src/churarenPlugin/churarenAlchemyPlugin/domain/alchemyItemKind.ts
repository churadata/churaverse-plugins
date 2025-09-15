import { KnownKeyOf } from 'churaverse-engine-client'
import { AlchemyItem } from './alchemyItem'

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface AlchemyItemKindMap {
  [key: string]: AlchemyItem
}

export type AlchemyItemKind = KnownKeyOf<AlchemyItemKindMap>
