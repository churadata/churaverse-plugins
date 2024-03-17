import { ITopBarIconContainer } from '../../../coreUiPlugin/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '../../../coreUiPlugin/topBarIcon'
import { IVoiceChatSender } from '../../domain/IVoiceChatSender'

export const MIC_ACTIVE_ICON_PATH = '../../assets/microphone.png'
export const MIC_INACTIVE_ICON_PATH = '../../assets/microphone_off.png'

export class MicIcon extends TopBarIconRenderer {
  public constructor(iconContainer: ITopBarIconContainer, private readonly voiceChatSender: IVoiceChatSender) {
    super({
      activeIconImgPath: MIC_ACTIVE_ICON_PATH,
      inactiveIconImgPath: MIC_INACTIVE_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: 200,
    })

    iconContainer.addIcon(this)
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      void this.tryStopVoiceStream()
    } else {
      void this.tryStartVoiceStream()
    }
  }

  /**
   * ボイスチャットを開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartVoiceStream(): Promise<void> {
    const isStartSuccessful = await this.voiceChatSender.startStream()
    if (isStartSuccessful ?? false) {
      super.activate()
    } else {
      super.deactivate()
    }
  }

  /**
   * ボイスチャットを停止する
   * 停止できなかった場合はbuttonを有効化
   */
  private async tryStopVoiceStream(): Promise<void> {
    const isStopSuccessful = await this.voiceChatSender.stopStream()
    if (isStopSuccessful ?? false) {
      super.deactivate()
    } else {
      super.activate()
    }
  }
}
