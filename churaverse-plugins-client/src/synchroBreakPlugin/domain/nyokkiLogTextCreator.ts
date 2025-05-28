import { Store, IMainScene } from 'churaverse-engine-client'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { PlayerNotExistsInPlayerRepositoryError } from '@churaverse/player-plugin-client/errors/playerNotExistsInPlayerRepositoryError'
import { INyokkiLogTextCreator } from '../interface/INyokkiLogTextCreator'

const successLogEnding = [
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

const failureLogEnding = [
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

export class NyokkiLogTextCreator implements INyokkiLogTextCreator {
  public constructor(private readonly store: Store<IMainScene>) {}

  /**
   * ニョッキアクションを実行時のログテキストを作成する
   * @param playerIds ニョッキアクションを実行したplayerIdの配列
   * @param isSuccess ニョッキアクションの成功可否
   */
  public createNyokkiLogText(playerIds: string[], isSuccess: boolean, nyokkiTime: number): string {
    if (isSuccess) {
      return this.generateSuccessLog(playerIds, nyokkiTime)
    } else {
      return this.generateFailureLog(playerIds, nyokkiTime)
    }
  }

  /**
   * ニョッキ成功時のログを生成する
   */
  private generateSuccessLog(playerIds: string[], nyokkiTime: number): string {
    const playerName = this.getPlayerName(playerIds[0])

    // 成功したメッセージをnyokkiTimeを基に生成する
    const seed = Math.floor(nyokkiTime / 100) % successLogEnding.length
    const message = successLogEnding[seed]
    return `${playerName}さん${message}`
  }

  /**
   * ニョッキ失敗時のログを生成する
   */
  private generateFailureLog(playerIds: string[], nyokkiTime: number): string {
    let message = this.buildPlayerNamePhrase(playerIds)

    // 失敗したメッセージをnyokkiTimeを基に生成する
    const seed = Math.floor(nyokkiTime / 100) % failureLogEnding.length
    message += failureLogEnding[seed]
    return message
  }

  /**
   * ニョッキアクションを未実行時のログテキストを作成する
   * @param playerIds ニョッキアクションを未実行のプレイヤーplayerIdの配列
   */
  public createNoNyokkiLogText(playerIds: string[]): string {
    let message = this.buildPlayerNamePhrase(playerIds)
    message += 'ニョッキ不発...'
    return message
  }

  /**
   * プレイヤー名を結合した文字列を作成する
   */
  private buildPlayerNamePhrase(playerIds: string[]): string {
    return playerIds
      .map((playerId, index) => {
        const playerName = this.getPlayerName(playerId)
        return index === playerIds.length - 1 ? `${playerName}さん` : `${playerName}さんと`
      })
      .join('')
  }

  /**
   * プレイヤーidからプレイヤー名を取得
   */
  private getPlayerName(playerId: string): string {
    const player: Player | undefined = this.store.of('playerPlugin').players.get(playerId)
    if (player === undefined) {
      throw new PlayerNotExistsInPlayerRepositoryError(playerId)
    }
    return player.name
  }
}
