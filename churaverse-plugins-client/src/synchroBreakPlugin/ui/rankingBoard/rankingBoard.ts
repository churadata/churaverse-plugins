import { DomManager, makeLayerHigherTemporary, AbstractDOMLayerNames, domLayerSetting } from 'churaverse-engine-client'
import style from './component/RankingOpenButtonComponent.module.scss'
import { BoardElement, boardProps, getRankColorClass } from './component/BoardElement'
import { NyokkiStatus } from '../../type/nyokkiStatus'
import { generateId } from '../util/idGenerator'
import { RankingOpenButtonComponent } from './component/RankingOpenButtonComponent'
import { IRankingBoard } from '../../interface/IRankingBoard'

export interface Props {
  layer?: AbstractDOMLayerNames
}

export const BOARD_ELEMENT_ID = (playerId: string): string => generateId('board-element', playerId)
export const PLAYER_RANK_ID = (playerId: string): string => generateId('player-rank', playerId)
export const PLAYER_NAME_ID = (playerId: string): string => generateId('player-name', playerId)
export const PLAYER_COINS_ID = (playerId: string): string => generateId('player-coins', playerId)
export const NYOKKI_STATUS_ID = (playerId: string): string => generateId('nyokki-status', playerId)

export const RANKING_BOARD_CONTAINER_ID = 'ranking-board-container'
export const RANKING_BOARD_ELEMENT_CONTAINER_ID = 'ranking-board-element-container'
export const RANKING_OPEN_BUTTON_ID = 'ranking-open-button'
export const RANKING_CLOSE_BUTTON_ID = 'ranking-close-button'

export class RankingBoard implements IRankingBoard {
  public element!: HTMLElement
  public readonly visible = true
  private elementContainer!: HTMLElement
  private rankingOpenButton!: HTMLElement
  private readonly playersElements = new Map<string, { boardElement: HTMLElement; visible: boolean }>()
  private turn!: HTMLDivElement
  private readonly statusMap = new Map<string, NyokkiStatus>()
  private playerOrders: string[] = []
  private isActive!: boolean

  public initialize(): void {
    this.setBoard()
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.setupPopupButton()
    this.open()
    console.log('rankingBoard initialized')
  }

  private setBoard(): void {
    // ランキングボードの生成
    const container = document.createElement('div')
    container.className = style.container
    container.style.overflowY = 'auto'
    container.style.transition = 'opacity 0.5s'
    container.style.display = 'none'
    container.id = RANKING_BOARD_CONTAINER_ID
    container.style.top = '100px'
    container.style.display = 'none'

    this.turn = document.createElement('div')
    this.turn.className = style.turn
    this.turn.textContent = ''
    container.appendChild(this.turn)

    const title = document.createElement('div')
    title.className = style.title
    title.textContent = 'ランキングボード'
    container.appendChild(title)
    this.element = container
    this.elementContainer = document.createElement('div')
    this.elementContainer.id = RANKING_BOARD_ELEMENT_CONTAINER_ID
    container.appendChild(this.elementContainer)

    // 閉じるボタンを生成
    const closeButton = document.createElement('button')
    closeButton.textContent = '閉じる'
    closeButton.id = RANKING_CLOSE_BUTTON_ID
    closeButton.className = style.closeButton
    closeButton.onclick = () => {
      this.closeRankingBoard()
    }
    container.appendChild(closeButton)
    const gameDiv = document.getElementById('game')
    gameDiv?.appendChild(container)
  }

  public removeBoard(): void {
    this.element.parentNode?.removeChild(this.element)
    this.rankingOpenButton.parentNode?.removeChild(this.rankingOpenButton)
  }

  public addBoardElement(setupData: boardProps, isActive: boolean): void {
    const boardElement = DomManager.jsxToDom(BoardElement(setupData)) // NyokkiStatusという名前は修正する
    const playerId = setupData.playerId
    this.playersElements.set(playerId, { boardElement, visible: !isActive })

    this.statusMap.set(playerId, 'yet')

    if (isActive) {
      boardElement.style.display = 'none'
    }
    this.elementContainer.appendChild(boardElement)
  }

  public removeBoardElement(playerId: string): void {
    const boardElement = this.playersElements.get(playerId)?.boardElement
    if (boardElement === undefined) return
    this.elementContainer.removeChild(boardElement)

    this.playersElements.delete(playerId)
  }

  public resetVisible(): void {
    this.playersElements.forEach((value, playerId) => {
      if (!value.visible) {
        value.visible = true
        value.boardElement.style.display = 'flex'
        this.elementContainer.appendChild(value.boardElement)
      }
    })

    this.updateRanking()
  }

  public updateRanking(): void {
    // const playerCoins = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()
    // this.elementContainer.innerHTML = ''
    // let offset = 0
    // let beforeCoins = -1
    // playerCoinsからゲーム参加中のプレイヤーのみを取得する
    // const visiblePlayerCoins = playerCoins.filter((playerData) => {
    //   const playerVisible = this.playersElements.get(playerData.playerId)?.visible
    //   return playerVisible !== undefined && playerVisible
    // })
    // visiblePlayerCoins.forEach((playerData, index) => {
    //   const { playerId, coins } = playerData
    //   const playerVisible = this.playersElements.get(playerId)?.visible
    //   if (playerVisible === undefined || !playerVisible) return
    //   const playerElement = this.playersElements.get(playerId)?.boardElement
    //   if (playerElement !== undefined) {
    //     this.elementContainer.appendChild(playerElement)
    //     let newRank = index + 1
    //     if (beforeCoins === coins) {
    //       offset++
    //       newRank -= offset
    //     } else {
    //       offset = 0
    //     }
    //     beforeCoins = coins
    //     this.changePlayerRank(playerId, newRank)
    //   }
    // })
  }

  public changeNyokkiStatus(playerId: string, status: NyokkiStatus): void {
    if (this.checkElementExists(RANKING_BOARD_CONTAINER_ID)) return
    const playerNyokkiStatus = DomManager.getElementById(NYOKKI_STATUS_ID(playerId))
    if (playerNyokkiStatus === null) return
    playerNyokkiStatus.textContent = status
    playerNyokkiStatus.className = `${style.status} ${style[status]}`
    this.statusMap.set(playerId, status)
    if (status === 'yet') return
    this.addPlayerOrders(playerId)
  }

  private addPlayerOrders(playerId: string): void {
    if (this.playerOrders.includes(playerId)) return
    this.playerOrders.push(playerId)
  }

  private checkElementExists(elementId: string): boolean {
    const element = document.getElementById(elementId)
    return element === null
  }

  private changePlayerRank(playerId: string, rank: number): void {
    const maxRetries = 5
    const delay = 100

    // タイミングによってはDOM要素が存在しない場合があるのでリトライするようにしています
    const attemptChange = (retries: number): void => {
      if (this.checkElementExists(RANKING_BOARD_CONTAINER_ID)) return
      if (this.checkElementExists(PLAYER_RANK_ID(playerId))) return

      const playerRank = DomManager.getElementById(PLAYER_RANK_ID(playerId))

      if (playerRank !== null) {
        playerRank.textContent = rank.toString() + '位'
        playerRank.className = getRankColorClass(rank)
      } else if (retries > 0) {
        setTimeout(() => {
          attemptChange(retries - 1)
        }, delay)
      } else {
        console.error(`Failed to find element with id: ${PLAYER_RANK_ID(playerId)} after ${maxRetries} attempts`)
      }
    }

    attemptChange(maxRetries)
  }

  public removePlayerOrders(playerId: string): void {
    if (!this.playerOrders.includes(playerId)) return
    this.playerOrders = this.playerOrders.filter((item) => item !== playerId)
  }

  public changePlayerName(playerId: string, newPlayerName: string): void {
    if (this.checkElementExists(RANKING_BOARD_CONTAINER_ID)) return
    const playerName = DomManager.getElementById(PLAYER_NAME_ID(playerId))
    playerName.textContent = newPlayerName
    playerName.className = style.playerId
  }

  public async changePlayersCoin(playerId: string, coins: number): Promise<void> {
    if (this.checkElementExists(RANKING_BOARD_CONTAINER_ID)) return

    const maxRetries = 5
    const delay = 100

    const attemptChange = async (retries: number): Promise<void> => {
      if (retries === 0) {
        console.error(`Failed to update coins for player with id: ${playerId} after ${maxRetries} attempts`)
        return
      }

      if (!this.checkElementExists(PLAYER_COINS_ID(playerId))) {
        const playersCoin = DomManager.getElementById(PLAYER_COINS_ID(playerId))
        playersCoin.textContent = coins.toString() + 'コイン'
      } else {
        await new Promise((resolve) => setTimeout(resolve, delay))
        await attemptChange(retries - 1)
      }
    }

    await attemptChange(maxRetries)
  }

  public async resetPlayerCoins(): Promise<void> {
    const defaulrtCoin = 100

    // 全プレイヤーの要素を取得
    const playersArray: Array<[string, HTMLElement]> = Array.from(this.playersElements)
      .filter(([key, value]) => value.visible)
      .map(([key, value]) => [key, value.boardElement])

    // 各プレイヤーの所持コインをデフォルト値にリセット
    await Promise.all(
      playersArray.map(async ([playerId]) => {
        await this.changePlayersCoin(playerId, defaulrtCoin)
      })
    )
  }

  public updateTurnNumber(turnNumber: number, allTurn: number): void {
    this.turn.textContent = `${turnNumber}  /  ${allTurn} ターン`
  }

  public allPlayerStatusReset(): void {
    const playersElements: Array<[string, HTMLElement]> = Array.from(this.playersElements)
      .filter(([key, value]) => value.visible)
      .map(([key, value]) => [key, value.boardElement])

    playersElements.forEach((v, k) => {
      this.changeNyokkiStatus(v[0], 'yet')
    })
  }

  public getPlayerOrders(playerId: string): number {
    return this.playerOrders.indexOf(playerId)
  }

  public getPlayerStatus(playerId: string): string {
    const playerNyokkiStatus = this.statusMap.get(playerId)
    return playerNyokkiStatus ?? 'yet'
  }

  public resetPlayerOrders(): void {
    this.playerOrders = []
  }

  public getTotalPlayerNum(): number {
    return this.playersElements.size
  }

  public get playersElementArray(): Array<[string, HTMLElement]> {
    const playersArray: Array<[string, HTMLElement]> = Array.from(this.playersElements)
      .filter(([key, value]) => value.visible)
      .map(([key, value]) => [key, value.boardElement])
    return playersArray
  }

  public open(): void {
    this.rankingOpenButton.style.display = 'flex'
  }

  public close(): void {
    if (this.isActive) this.closeRankingBoard()
    this.turn.textContent = ''
    this.rankingOpenButton.style.display = 'none'
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.element.parentNode?.removeChild(this.element)
    this.rankingOpenButton.parentNode?.removeChild(this.rankingOpenButton)
  }

  private setupPopupButton(): void {
    this.rankingOpenButton = document.createElement('div')
    this.rankingOpenButton.append(DomManager.jsxToDom(RankingOpenButtonComponent()))
    this.rankingOpenButton.style.display = 'none'
    const gameDiv = document.getElementById('game')
    gameDiv?.appendChild(this.rankingOpenButton)
    this.isActive = false
    this.rankingOpenButton.onclick = () => {
      this.toggleRankingBoard()
    }
  }

  private toggleRankingBoard(): void {
    this.isActive = !this.isActive
    const rankingBoard = document.getElementById('ranking-board-container')

    if (rankingBoard !== null && rankingBoard !== undefined) {
      rankingBoard.style.display = 'flex'
    }
    const openButton = document.getElementById(RANKING_OPEN_BUTTON_ID)
    if (openButton !== null && openButton !== undefined) {
      openButton.style.display = 'none'
    }
  }

  private closeRankingBoard(): void {
    this.isActive = false
    const rankingBoard = document.getElementById('ranking-board-container')
    if (rankingBoard !== null && rankingBoard !== undefined) {
      rankingBoard.style.display = 'none'
    }
    const openButton = document.getElementById(RANKING_OPEN_BUTTON_ID)
    if (openButton !== null && openButton !== undefined) {
      openButton.style.display = 'flex'
    }
  }

  public makeYetPlayersNyokki(players: string[]): void {
    for (let i = 0; i < players.length; i++) {
      const playerId = players[i]
      const status = this.statusMap.get(playerId)

      if (status === 'yet') {
        this.changeNyokkiStatus(playerId, 'nyokki')
      }
    }
  }
}
