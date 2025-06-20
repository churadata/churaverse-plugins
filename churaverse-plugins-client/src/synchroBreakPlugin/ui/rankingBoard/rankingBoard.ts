import {
  Store,
  IMainScene,
  DomManager,
  makeLayerHigherTemporary,
  AbstractDOMLayerNames,
  domLayerSetting,
} from 'churaverse-engine-client'
import { PlayerRankingElement, boardProps } from './component/PlayerRankingElement'
import { generateId } from '../util/idGenerator'
import { RankingOpenButton } from './component/RankingOpenButton'
import { RankingBoardElement } from './component/RankingBoardElement'
import { IRankingBoard } from '../../interface/IRankingBoard'
import { NyokkiStatus } from '../../type/nyokkiStatus'

export interface Props {
  layer?: AbstractDOMLayerNames
}

/** ランキングボード全体のUI */
export const RANKING_BOARD_CONTAINER_ID = 'ranking-board-container'
/** ランキングボードのプレイヤー要素を追加するコンテナ */
export const RANKING_BOARD_ELEMENT_CONTAINER_ID = 'ranking-board-element-container'
/** ランキングボードのターン表示 */
export const RANKING_BOARD_ELEMENT_TURN_ID = 'ranking-board-turn-container'
/** ランキングボードを閉じるボタン */
export const RANKING_CLOSE_BUTTON_ID = 'ranking-close-button'
/** ランキングボードを開くボタン */
export const RANKING_OPEN_BUTTON_ID = 'ranking-open-button'

/** プレイヤーランキング行の要素ID */
export const BOARD_ELEMENT_ID = (playerId: string): string => generateId('board-element', playerId)
/** プレイヤーの順位表示要素ID */
export const PLAYER_RANK_ID = (playerId: string): string => generateId('player-rank', playerId)
/**  プレイヤー名表示要素ID */
export const PLAYER_NAME_ID = (playerId: string): string => generateId('player-name', playerId)
/** プレイヤーのコイン表示要素ID */
export const PLAYER_COINS_ID = (playerId: string): string => generateId('player-coins', playerId)
/** プレイヤーのニョッキステータス表示要素ID */
export const NYOKKI_STATUS_ID = (playerId: string): string => generateId('nyokki-status', playerId)

export class RankingBoard implements IRankingBoard {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private rankingOpenButton!: HTMLElement

  public constructor(public readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.setupPopupButton()
    this.setupRankingBoard()

    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
  }

  private setupPopupButton(): void {
    this.rankingOpenButton = DomManager.addJsxDom(RankingOpenButton())
    this.rankingOpenButton.style.display = 'flex'
    this.rankingOpenButton.onclick = () => {
      this.toggleRankingBoard()
    }
  }

  /**
   * ランキングを表示ボタンを押された際の処理
   */
  private toggleRankingBoard(): void {
    this.element.style.display = 'flex'
    this.rankingOpenButton.style.display = 'none'
  }

  private setupRankingBoard(): void {
    this.element = DomManager.addJsxDom(RankingBoardElement())
    const closeButton = DomManager.getElementById(RANKING_CLOSE_BUTTON_ID)
    closeButton.onclick = () => {
      this.closeRankingBoard()
    }
  }

  /**
   * ランキンボードが閉じるボタンが押された際の処理
   */
  private closeRankingBoard(): void {
    this.element.style.display = 'none'
    this.rankingOpenButton.style.display = 'flex'
  }

  /**
   * プレイヤーのランキング要素を追加する
   */
  public addRankingElement(playerId: string, rank: number, coins: number): void {
    const playerName = this.store.of('playerPlugin').players.get(playerId)?.name
    if (playerName === undefined) return
    const status = 'yet'
    const props: boardProps = { playerId, playerName, rank, coins, status }
    const playerRankingElement = DomManager.addJsxDom(PlayerRankingElement(props))
    const boardElementContainer = DomManager.getElementById(RANKING_BOARD_ELEMENT_CONTAINER_ID)
    boardElementContainer.appendChild(playerRankingElement)
  }

  /**
   * ターン数を更新する
   */
  public updateTurnNumber(turnNumber: number, allTurn: number): void {
    const boardElementTurn = DomManager.getElementById(RANKING_BOARD_ELEMENT_TURN_ID)
    boardElementTurn.textContent = `${turnNumber}  /  ${allTurn} ターン`
  }

  /**
   * プレイヤーの所持コイン数を変更する
   */
  public changePlayersCoin(playerId: string, coins: number): void {
    const playerCoins = DomManager.getElementById(PLAYER_COINS_ID(playerId))
    if (playerCoins === null) return
    playerCoins.textContent = `${coins}コイン`
  }

  /**
   * プレイヤーのニョッキステータスを変更する
   */
  public changeNyokkiStatus(playrId: string, status: NyokkiStatus): void {
    const playerNyokkiStatus = DomManager.getElementById(NYOKKI_STATUS_ID(playrId))
    if (playerNyokkiStatus === null) return

    playerNyokkiStatus.textContent = status
    // ニョッキステータスのdata-status属性を変更
    playerNyokkiStatus.dataset.status = status
  }

  /**
   * ランキングボードを更新する
   */
  public updateRanking(): void {
    const boardElementContainer = DomManager.getElementById(RANKING_BOARD_ELEMENT_CONTAINER_ID)
    boardElementContainer.innerHTML = ''
    const sortedPlayersCoin = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()

    let currentRank = 1
    let previousCoins = sortedPlayersCoin[0]?.coins ?? 0

    sortedPlayersCoin.forEach((player, index) => {
      if (index > 0 && player.coins < previousCoins) {
        currentRank = index + 1
      }
      this.addRankingElement(player.playerId, currentRank, player.coins)
      previousCoins = player.coins
    })
  }

  /**
   * ニョッキステータスをyetにする
   */
  public resetNyokkiStatus(playerIds: string[]): void {
    playerIds.forEach((playerId) => {
      this.changeNyokkiStatus(playerId, 'yet')
    })
  }

  /**
   * ランキングボードを削除する
   */
  public remove(): void {
    this.rankingOpenButton.remove()
    this.element.remove()
  }
}
