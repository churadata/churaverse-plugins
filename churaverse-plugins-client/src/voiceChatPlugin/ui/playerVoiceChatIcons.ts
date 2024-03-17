import { Scene } from 'phaser'
import { PlayerMicIcon } from './voiceChatIcon/playerMicIcon'
import { IMainScene, Store } from 'churaverse-engine-client'
import { PlayerMegaphoneIcon } from './voiceChatIcon/playerMegaphoneIcon'

/**
 * 各プレイヤーの周りにボイスチャット関連のアイコンを配置するクラス
 */
export class PlayerVoiceChatIcons {
  public readonly playerMicIcon?: PlayerMicIcon
  public readonly playerMegaphoneIcon?: PlayerMegaphoneIcon
  public constructor(scene: Scene, store: Store<IMainScene>, playerId: string) {
    const playerRenderer = store.of('playerPlugin').playerRenderers.get(playerId)
    if (playerRenderer === undefined) return
    this.playerMicIcon = new PlayerMicIcon(scene, playerRenderer)
    this.playerMegaphoneIcon = new PlayerMegaphoneIcon(scene, playerRenderer)
  }
}
