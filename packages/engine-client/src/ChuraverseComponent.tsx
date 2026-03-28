import { useEffect } from 'react'
import 'phaser'
import { MainScene } from './scene/main'
import { TitleScene } from './scene/title'
import { DomManager } from './ui/domManager'
import './ChuraverseComponent.module.scss'

// Phaserの設定
const defaultConfig: Phaser.Types.Core.GameConfig = {
  width: 1280,
  height: 720,
  type: Phaser.AUTO,
  pixelArt: true,
  backgroundColor: 0xcdcdcd,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    parent: 'game',
    fullscreenTarget: 'game',
  },

  dom: {
    createContainer: true,
  },

  fps: {
    target: 60,
    forceSetTimeOut: true,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      tileBias: 40,
    },
  },
  // ここで読み込むシーンを取得する
  scene: [TitleScene, MainScene],
}

export const Churaverse: React.FC<{ gameConfig?: Phaser.Types.Core.GameConfig }> = ({ gameConfig = defaultConfig }) => {
  // 画面の発描写時に実行する
  // 画面の終了時にはGameをDestroyする
  useEffect(() => {
    DomManager.setUiContainer()
    const g = new Phaser.Game(gameConfig)
    return () => {
      g?.destroy(true)
    }
  }, [])

  return (
    <div id="game">
      <div className="uiContainer" id="uiContainer"></div>
    </div>
  )
}
