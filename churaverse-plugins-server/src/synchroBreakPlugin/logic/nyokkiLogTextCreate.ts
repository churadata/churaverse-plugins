import { IPlayerRepository } from '@churaverse/player-plugin-server/domain/IPlayerRepository'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { INyokkiLogTextCreate } from '../interface/INyokkiLogTextCreate'

const nyokkiSafeLogEnding = [
  'はnyokkiに成功しました',
  '素晴らしい!!、nyokki成功',
  'nyokki成功。ナイス!!',
  'nyokkiミッション成功',
  'は見事にnyokkiを達成しました',
  'nyokki達成お見事',
  '最高のnyokki成功',
  '完璧なnyokki',
  'nyokki成功',
  'nyokki成功、賞金ゲット!!',
]

const nyokkiOutLogEnding = [
  'はnyokkiに失敗しました。次は頑張って!!',
  'のnyokkiが被ったーー',
  '息ぴったし',
  'のnyokki失敗、次は賞金を狙おう!!',
  'はチャレンジ失敗',
  'はnyokki達成ならず、残念',
  '惜しい、nyokki失敗',
  'nyokki失敗、また挑戦しよう',
  '残念、nyokkiはうまくいきませんでした',
  'のnyokki失敗',
]

export class NyokkiLogTextCreate implements INyokkiLogTextCreate {
  public constructor(private readonly players: IPlayerRepository) {}

  public nyokkiLogTextCreate(playerIds: string[], nyokkiStatus: boolean): string {
    if (nyokkiStatus) {
      return this.nyokkiOutLog(playerIds)
    } else {
      return this.nyokkiSafeLog(playerIds)
    }
  }

  private nyokkiSafeLog(playerIds: string[]): string {
    const playerName: Player | undefined = this.players.get(playerIds[0])
    if (playerName === undefined) throw new Error('nyokkiアクションでプレイヤーIDの取得に失敗')
    const message = nyokkiSafeLogEnding[Math.floor(Math.random() * nyokkiSafeLogEnding.length)]
    return `${playerName.name}さん${message}`
  }

  private nyokkiOutLog(playerIds: string[]): string {
    let message: string = ''
    for (let i = 0; i < playerIds.length; i++) {
      const playerName: Player | undefined = this.players.get(playerIds[i])
      if (playerName === undefined) throw new Error('nyokkiアクションでプレイヤーIDの取得に失敗')
      // 最後のプレイヤー名は'と'を省く
      if (i === playerIds.length - 1) {
        message += `${playerName.name}さん`
      } else {
        message += `${playerName.name}さんと`
      }
    }
    message += nyokkiOutLogEnding[Math.floor(Math.random() * nyokkiOutLogEnding.length)]
    return message
  }
}
