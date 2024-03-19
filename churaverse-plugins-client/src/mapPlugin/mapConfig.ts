import { GRID_SIZE } from 'churaverse-engine-client'
import { IMapConfig } from './interface/IMapConfig'

export const mapConfig: IMapConfig = {
  maps: {
    map1: {
      displayName: 'Map1',
      jsonName: 'Map.json',
      tilesets: ['map_tile'],
      pluginOptions: {
        groundScreenPos: { x: 800 - GRID_SIZE / 2, y: 400 - GRID_SIZE / 2 },
      },
    },
    map2: {
      displayName: 'Map2',
      jsonName: 'Map2.json',
      tilesets: ['map_tile'],
      pluginOptions: {
        groundScreenPos: { x: 800 - GRID_SIZE / 2, y: 800 - GRID_SIZE / 2 },
      },
    },
  },
}
