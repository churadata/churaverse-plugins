import { BasePlugin, IMainScene } from 'churaverse-engine-server'

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-indexed-object-style
export interface GameIdsMap {
  [key: string]: BasePlugin<IMainScene>
}
export type GameIds = keyof GameIdsMap
