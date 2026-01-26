import { PlayersRepository } from '@churaverse/player-plugin-client/repository/playerRepository'
import { IVoiceChatVolumeController } from './domain/IVoiceChatVolumeController'

export class VoiceChatVolumeController implements IVoiceChatVolumeController {
  private readonly voices = new Map<string, HTMLAudioElement>()
  /**
   * メガホンをオンにしたプレイヤーのid
   */
  private readonly megaphoneActiveMap = new Map<string, boolean>()

  public setVolume(playerId: string, volume: number): void {
    const voice = this.voices.get(playerId)

    if (voice === undefined) return

    voice.volume = volume
  }

  public addVoice(playerId: string, voice: HTMLAudioElement): void {
    this.voices.set(playerId, voice)
  }

  public deleteVoice(playerId: string): void {
    this.voices.delete(playerId)
  }

  public activateMegaphone(playerId: string): void {
    this.megaphoneActiveMap.set(playerId, true)
    this.setVolume(playerId, 1)
  }

  public deactivateMegaphone(playerId: string): void {
    this.megaphoneActiveMap.set(playerId, false)
  }

  public isActiveMegaphoneById(playerId: string): boolean {
    return this.megaphoneActiveMap.get(playerId) ?? false
  }

  public updateAccordingToDistance(ownPlayerId: string, players: PlayersRepository): void {
    const ownPlayer = players.get(ownPlayerId)
    if (ownPlayer === undefined) return

    const audibleDistance = 400

    for (const playerId of players.getAllId()) {
      if (playerId === ownPlayerId) continue

      const player = players.get(playerId)
      if (player === undefined) continue

      // メガホンを使用している場合は音量調整しない
      if (this.megaphoneActiveMap.get(playerId) ?? false) continue

      const distance = ownPlayer.position.distanceTo(player.position)

      const attenuatedVolume = (audibleDistance - (distance / Math.sqrt(audibleDistance)) ** 2) / audibleDistance
      const volume = Math.max(0, attenuatedVolume)

      this.setVolume(playerId, volume)
    }
  }
}
