import { Scene } from 'phaser'
import { EntitySpawnEvent, PhaserLoadAssets, IMainScene, BasePlugin, PhaserSceneInit } from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client/store/defWebRtcPluginStore'
import { SocketController } from './controller/socketController'
import { IVoiceChatSender } from './domain/IVoiceChatSender'
import { JoinVoiceChatEvent } from './event/joinVoiceChatEvent'
import { LeaveVoiceChatEvent } from './event/leaveVoiceChatEvent'
import { MuteEvent } from './event/muteEvent'
import { ToggleMegaphoneEvent } from './event/toggleMegaphoneEvent'
import { UnmuteEvent } from './event/unmuteEvent'
import { ToggleMegaphoneMessage } from './message/toggleMegaphoneMessage'
import { VoiceChatPluginStore } from './store/defVoiceChatPluginStore'
import { initVoiceChatPluginStore } from './store/initVoiceChatPluginStore'
import { PlayerVoiceChatIcons } from './ui/playerVoiceChatIcons'
import { PlayerMicIcon } from './ui/voiceChatIcon/playerMicIcon'
import { VoiceChatUi } from './ui/voiceChatUi'
import { VoiceChatReceiver } from './voiceChatReceiver'
import { VoiceChatSender } from './voiceChatSender'
import { VoiceChatVolumeController } from './voiceChatVolumeController'
import { DebugScreenPluginStore } from '@churaverse/debug-screen-plugin-client/store/defDebugScreenPluginStore'
import { MicrophoneMyStatusDebugDetailScreen } from './debugScreen/microphoneMyStatusDebugDetailScreen'
import { MegaphoneMyStatusDebugDetailScreen } from './debugScreen/megaphoneMyStatusDebugDetailScreen'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenSection'
import {
  IMegaphoneMyStatusDebugDetailScreen,
  IMicrophoneMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IVoiceChatInfoDebugDetailScreen'
import { DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client/event/dumpDebugDataEvent'

export class VoiceChatPlugin extends BasePlugin<IMainScene> {
  private voiceChatPluginStore!: VoiceChatPluginStore
  private webRtcPluginStore!: WebRtcPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private debugScreenPluginStore!: DebugScreenPluginStore
  private voiceChatSender?: IVoiceChatSender
  private voiceChatUi?: VoiceChatUi
  private voiceChatVolumeController?: VoiceChatVolumeController
  private scene?: Scene
  private microphoneMyStatusDebugDetailScreen!: IMicrophoneMyStatusDebugDetailScreen
  private megaphoneMyStatusDebugDetailScreen!: IMegaphoneMyStatusDebugDetailScreen

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.startVoiceChatVolumeControl.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('entitySpawn', this.onJoinPlayer.bind(this))
    this.bus.subscribeEvent('joinVoiceChat', this.joinVoiceChat.bind(this))
    this.bus.subscribeEvent('leaveVoiceChat', this.leaveVoiceChat.bind(this))
    this.bus.subscribeEvent('mute', this.onMute.bind(this))
    this.bus.subscribeEvent('unmute', this.onUnmute.bind(this))
    this.bus.subscribeEvent('toggleMegaphone', this.toggleMegaphone.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    initVoiceChatPluginStore(this.store)
    this.getStores()

    void new VoiceChatReceiver(
      this.webRtcPluginStore.webRtc.room,
      this.bus,
      this.voiceChatPluginStore.playerVoiceChatUis
    )
    this.voiceChatSender = new VoiceChatSender(
      this.webRtcPluginStore.webRtc.room,
      this.bus,
      this.store,
      this.playerPluginStore.ownPlayerId
    )
    this.voiceChatUi = new VoiceChatUi(this.store, this.bus, this.voiceChatSender)
    this.voiceChatVolumeController = new VoiceChatVolumeController()
    this.setupDebugScreen()
  }

  private getStores(): void {
    this.voiceChatPluginStore = this.store.of('voiceChatPlugin')
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
  }

  /**
   * ボイスチャットの音量を距離に応じて調整する
   */
  private startVoiceChatVolumeControl(): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const players = this.playerPluginStore.players
    const ownPlayer = players.get(ownPlayerId)
    if (ownPlayer === undefined) return

    // 300ms毎に更新
    setInterval(() => {
      this.voiceChatVolumeController?.updateAccordingToDistance(ownPlayerId, players)
    }, 300)
    // this.setupDebugScreen()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('voiceChatInfo', 'VoiceChat'))
    this.microphoneMyStatusDebugDetailScreen = new MicrophoneMyStatusDebugDetailScreen(debugDetailScreenContainer)
    this.megaphoneMyStatusDebugDetailScreen = new MegaphoneMyStatusDebugDetailScreen(debugDetailScreenContainer)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerMicIcon.loadAssets(ev.scene)
  }

  private onJoinPlayer(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    const playerId = ev.entity.id
    this.bus.post(new ToggleMegaphoneEvent(playerId, true))
    this.voiceChatVolumeController?.activateMegaphone(playerId)
    if (this.scene === undefined) return
    const playerVoiceChatUi = new PlayerVoiceChatIcons(this.scene, this.store, ev.entity.id)
    this.voiceChatPluginStore.playerVoiceChatUis.set(playerId, playerVoiceChatUi)
  }

  private joinVoiceChat(ev: JoinVoiceChatEvent): void {
    this.voiceChatVolumeController?.addVoice(ev.playerId, ev.voice)
  }

  private leaveVoiceChat(ev: LeaveVoiceChatEvent): void {
    this.voiceChatVolumeController?.deleteVoice(ev.playerId)
  }

  private onMute(ev: MuteEvent): void {
    const playerMicIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(ev.playerId)?.playerMicIcon
    playerMicIcon?.handleMicIcons(false)
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    if (ev.playerId !== ownPlayerId) return
    this.microphoneMyStatusDebugDetailScreen.update(false)
  }

  private onUnmute(ev: UnmuteEvent): void {
    const playerMicIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(ev.playerId)?.playerMicIcon
    playerMicIcon?.handleMicIcons(true)
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    if (ev.playerId !== ownPlayerId) return
    this.microphoneMyStatusDebugDetailScreen.update(true)
  }

  /**
   * メガホン機能のON/OFFを切り替える
   * @param playerId メガホン機能をトグルするプレイヤー
   * @param active trueの時メガホン機能をON
   */
  private toggleMegaphone(ev: ToggleMegaphoneEvent): void {
    // プレイヤー周りのメガホンアイコン切り替え
    const playerMegaphoneIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(ev.playerId)?.playerMegaphoneIcon
    playerMegaphoneIcon?.handleMegaphone(ev.active)

    if (ev.active) {
      this.voiceChatVolumeController?.activateMegaphone(ev.playerId)
    } else {
      this.voiceChatVolumeController?.deactivateMegaphone(ev.playerId)
    }

    // 自プレイヤーが切り替えた場合は他プレイヤーに通知するだけ
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    if (ev.playerId === ownPlayerId) {
      this.megaphoneMyStatusDebugDetailScreen.update(ev.active)
      this.networkPluginStore.messageSender.send(
        new ToggleMegaphoneMessage({ playerId: this.playerPluginStore.ownPlayerId, active: ev.active })
      )
    }
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownParticipant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(ownPlayerId)
    const ownMicrophoneStatus = ownParticipant !== undefined ? String(ownParticipant.isMicrophoneEnabled) : 'undefined'
    ev.dataDumper.dump('microphoneIsOn', ownMicrophoneStatus)

    const isActiveMegaphone = this.voiceChatVolumeController?.isActiveMegaphoneById(ownPlayerId)
    ev.dataDumper.dump('megaphoneIsOn', String(isActiveMegaphone))
  }
}
