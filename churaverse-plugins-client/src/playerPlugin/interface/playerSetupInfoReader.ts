import { IPersistStore } from '../../dataPersistencePlugin/interface/IPersistStore'

import { PlayerColor } from '../types/playerColor'
import { PlayerRole } from '../types/playerRole'
import { PLAYER_SETUP_PROPERTY, PlayerSetupInfo } from './playerSetupInfo'
// プレイヤーの初期情報を取得するクラス
export class PlayerSetupInfoReader {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public read(): PlayerSetupInfo {
    const info: PlayerSetupInfo = {
      name: this.cookieRepository.read(PLAYER_SETUP_PROPERTY.name),
      color: this.cookieRepository.read(PLAYER_SETUP_PROPERTY.color) as PlayerColor,
      role: this.cookieRepository.read(PLAYER_SETUP_PROPERTY.role) as PlayerRole,
    }
    return info
  }
}
