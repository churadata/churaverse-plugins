import {
  Store,
  IMainScene,
  DomManager,
  makeLayerHigherTemporary,
  AbstractDOMLayerNames,
  domLayerSetting,
} from 'churaverse-engine-client'
import { PlayerRankingElement, boardProps, getNyokkiStatusClass } from './component/PlayerRankingElement'
import { generateId } from '../util/idGenerator'
import { RankingOpenButton } from './component/RankingOpenButton'
import { RankingBoardElement } from './component/RankingBoardElement'
import { IRankingBoard } from '../../interface/IRankingBoard'
import { NyokkiStatus } from '../../type/nyokkiStatus'
import style from './component/PlayerRankingElement.module.scss'

export interface Props {
  layer?: AbstractDOMLayerNames
}

/* ランキングボード全体のUI */
export const RANKING_BOARD_CONTAINER_ID = 'ranking-board-container'
/* ランキングボードの一行のコンテナ */
export const RANKING_BOARD_ELEMENT_CONTAINER_ID = 'ranking-board-element-container'
/* ランキングボードの一行のコンテナ */
export const RANKING_BOARD_ELEMENT_TURN_ID = 'ranking-board-turn-container'
/* ランキングボードを閉じるボタン */
export const RANKING_CLOSE_BUTTON_ID = 'ranking-close-button'
/* ランキングボードを開くボタン */
export const RANKING_OPEN_BUTTON_ID = 'ranking-open-button'

export const BOARD_ELEMENT_ID = (playerId: string): string => generateId('board-element', playerId)
export const PLAYER_RANK_ID = (playerId: string): string => generateId('player-rank', playerId)
export const PLAYER_NAME_ID = (playerId: string): string => generateId('player-name', playerId)
export const PLAYER_COINS_ID = (playerId: string): string => generateId('player-coins', playerId)
export const NYOKKI_STATUS_ID = (playerId: string): string => generateId('nyokki-status', playerId)

export class RankingBoard implements IRankingBoard {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private rankingOpenButton!: HTMLElement
  private turn!: HTMLDivElement

  public constructor(public readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.setupPopupButton()
    this.setupRankingBoard()
    this.turn = document.createElement('div')
    this.turn.id = RANKING_BOARD_ELEMENT_TURN_ID
    this.element.appendChild(this.turn)
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

  public addRankingElement(playerId: string, rank: number, coins: number): void {
    const playerName = this.store.of('playerPlugin').players.get(playerId)?.name
    if (playerName === undefined) return
    const status = 'yet'
    const props: boardProps = { playerId, playerName, rank, coins, status }
    const playerRankingElement = DomManager.addJsxDom(PlayerRankingElement(props))
    const boardElementContainer = DomManager.getElementById(RANKING_BOARD_ELEMENT_CONTAINER_ID)
    boardElementContainer.appendChild(playerRankingElement)
  }

  public updateTurnNumber(turnNumber: number, allTurn: number): void {
    this.turn.textContent = `${turnNumber}  /  ${allTurn} ターン`
    const boardElementTurn = DomManager.getElementById(RANKING_BOARD_ELEMENT_TURN_ID)
    boardElementTurn.appendChild(this.turn)
  }

  public changePlayersCoin(playerId: string, coins: number): void {
    if (!this.checkElementExist(RANKING_BOARD_CONTAINER_ID)) return
    const playerCoins = DomManager.getElementById(PLAYER_COINS_ID(playerId))
    if (playerCoins === null) return
    playerCoins.textContent = `${coins}コイン`
  }

  public changeNyokkiStatus(playrId: string, status: NyokkiStatus): void {
    if (!this.checkElementExist(RANKING_BOARD_CONTAINER_ID)) return
    const playerNyokkiStatus = DomManager.getElementById(NYOKKI_STATUS_ID(playrId))
    if (playerNyokkiStatus === null) return

    // textContentを更新
    playerNyokkiStatus.textContent = status

    // クラス名を更新 - 既存のstatus系クラスをすべて削除してから新しいクラスを追加
    playerNyokkiStatus.classList.remove(style.yet, style.success, style.nyokki)
    playerNyokkiStatus.classList.add(style.status)
    playerNyokkiStatus.classList.add(getNyokkiStatusClass(status))

    // data属性も更新
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

  public resetNyokkiStatus(playerIds: string[]): void {
    playerIds.forEach((playerId) => {
      this.changeNyokkiStatus(playerId, 'yet')
    })
  }

  public changeNyokkiStatusToFail(playerIds: string[]): void {
    playerIds.forEach((playerId) => {
      this.changeNyokkiStatus(playerId, 'nyokki')
    })
  }

  private checkElementExist(elementId: string): boolean {
    const element = document.getElementById(elementId)
    return element !== null
  }

  public remove(): void {
    this.rankingOpenButton.remove()
    this.element.remove()
  }
}
