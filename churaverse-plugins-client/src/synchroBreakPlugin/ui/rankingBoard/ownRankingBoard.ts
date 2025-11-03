import {
  Store,
  IMainScene,
  DomManager,
  makeLayerHigherTemporary,
  AbstractDOMLayerNames,
  domLayerSetting,
} from 'churaverse-engine-client'
import { OwnRankingElement } from './component/OwnRankingElement'
import { IOwnRankingBoard } from '../../interface/IOwnRankingBoard'
import { NyokkiStatus } from '../../type/nyokkiStatus'

export interface Props {
  layer?: AbstractDOMLayerNames
}

/** 自分のランキング全体のUI */
export const MY_RANKING_CONTAINER_ID = 'my-ranking-container'
/** 自分の順位表示要素ID */
export const MY_RANKING_RANK_ID = 'my-ranking-rank'
/** 自分の名前表示要素ID */
export const MY_RANKING_NAME_ID = 'my-ranking-name'
/** 自分のコイン表示要素ID */
export const MY_RANKING_COINS_ID = 'my-ranking-coins'
/** 自分のニョッキステータス表示要素ID */
export const MY_RANKING_STATUS_ID = 'my-ranking-status'

export class OwnRankingBoard implements IOwnRankingBoard {
  public element!: HTMLElement
  public readonly visible: boolean = true

  public constructor(public readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.setupOwnRanking()

    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })

    this.element.style.display = 'flex'
  }

  /**
   * プレイヤーの所持コイン数を変更する
   */
  public changePlayersCoin(playerId: string, coins: number): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (playerId !== ownPlayerId) return

    const myRankingCoins = DomManager.getElementById(MY_RANKING_COINS_ID)
    if (myRankingCoins === null) return
    myRankingCoins.textContent = `${coins}コイン`
  }

  /**
   * プレイヤーのニョッキステータスを変更する
   */
  public changeNyokkiStatus(playerId: string, status: NyokkiStatus): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (playerId !== ownPlayerId) return

    const myRankingStatus = DomManager.getElementById(MY_RANKING_STATUS_ID)
    if (myRankingStatus === null) return

    myRankingStatus.textContent = status
    myRankingStatus.dataset.status = status
  }

  /**
   * ランキングボードを更新する
   */
  public updateRanking(): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    const sortedPlayersCoin = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()

    let currentRank = 1
    let previousCoins = sortedPlayersCoin[0]?.coins ?? 0
    let myRank = 0
    let myCoins = 0

    // 自分のランキングを計算
    sortedPlayersCoin.forEach((player, index) => {
      if (index > 0 && player.coins < previousCoins) {
        currentRank = index + 1
      }
      if (player.playerId === ownPlayerId) {
        myRank = currentRank
        myCoins = player.coins
      }
      previousCoins = player.coins
    })

    const myRankingRank = DomManager.getElementById(MY_RANKING_RANK_ID)
    const myRankingName = DomManager.getElementById(MY_RANKING_NAME_ID)
    const myRankingCoins = DomManager.getElementById(MY_RANKING_COINS_ID)

    if (myRankingRank !== null) {
      myRankingRank.textContent = `${myRank}位`
      // ランキングに応じた色を設定
      myRankingRank.className = this.getRankColorClass(myRank)
    }

    if (myRankingName !== null) {
      const myName = this.store.of('playerPlugin').players.get(ownPlayerId)?.name ?? '自分'
      myRankingName.textContent = myName
    }

    if (myRankingCoins !== null) {
      myRankingCoins.textContent = `${myCoins}コイン`
    }
  }

  /**
   * ニョッキステータスをyetにする
   */
  public resetNyokkiStatus(playerIds: string[]): void {
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (playerIds.includes(ownPlayerId)) {
      this.changeNyokkiStatus(ownPlayerId, 'yet')
    }
  }

  private setupOwnRanking(): void {
    this.element = DomManager.addJsxDom(OwnRankingElement())
  }

  private readonly getRankColorClass = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'gold'
      case 2:
        return 'silver'
      case 3:
        return 'bronze'
      default:
        return 'black'
    }
  }

  /**
   * ランキングボードを削除する
   */
  public remove(): void {
    this.element.remove()
  }
}
