import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { IMainScene, LivingDamageEvent } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { ItemPluginStore } from '@churaverse/churaren-item-plugin-server/store/defItemPluginStore'
import { ChurarenPlayersStore } from './store/defChurarenPlayersStore'
import { SocketController } from './controller/socketController'
import { initChurarenPlayersStore, resetChurarenPlayersStore } from './store/initChurarenPlayersStore'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { GetChurarenItemEvent } from './event/getChurarenItemEvent'
import { GetChurarenItemData, GetChurarenItemMessage } from './message/getChurarenItemMessage'
import { DropChurarenItemEvent } from './event/dropChurarenItemEvent'
import { PlayerItemsStore } from './store/defPlayerItemsStore'
import { initPlayerItemStore, resetPlayerItemStore } from './store/initPlayerItemsStore'
import { InvicibleTimeMessage } from './message/invicibleTimeMessage'
import { isPlayer, Player } from '@churaverse/player-plugin-server/domain/player'
import { ChurarenResultEvent } from '@churaverse/churaren-core-plugin-server/event/churarenResultEvent'
import { PlayerHealEvent } from './event/playerHealEvent'
import { PlayerRevivalMessage } from './message/playerRevivalMessage'
import { PlayerHealMessage } from './message/playerHealMessage'
import { UseRevivalItemEvent } from '@churaverse/churaren-revival-item-plugin-server/event/useRevivalItemEvent'

export const MAX_ITEMS = 3

export class ChurarenPlayerPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private itemPluginStore!: ItemPluginStore
  private playerPluginStore!: PlayerPluginStore
  private churarenPlayerStore!: ChurarenPlayersStore
  private playerItemStore!: PlayerItemsStore
  private socketController?: SocketController
  private readonly inviciblePlayersList: string[] = []
  private readonly INVICIBLE_TIME = 2000 // 無敵時間

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('getChurarenItem', this.getItem)
    this.bus.subscribeEvent('dropChurarenItem', this.dropItem)
    this.bus.subscribeEvent('livingDamage', this.onChurarenDamageFromBoss)
    this.bus.subscribeEvent('livingDamage', this.skipDamage, 'HIGH')
    this.bus.subscribeEvent('playerHeal', this.onLivingHeal)
    this.bus.subscribeEvent('useRevivalItem', this.onUseRevivalItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('getChurarenItem', this.getItem)
    this.bus.unsubscribeEvent('dropChurarenItem', this.dropItem)
    this.bus.unsubscribeEvent('livingDamage', this.onChurarenDamageFromBoss)
    this.bus.unsubscribeEvent('livingDamage', this.skipDamage)
    this.bus.unsubscribeEvent('playerHeal', this.onLivingHeal)
    this.bus.unsubscribeEvent('useRevivalItem', this.onUseRevivalItem)
  }

  protected handleGameStart(): void {
    initPlayerItemStore(this.store)
    initChurarenPlayersStore(this.store)
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.playerItemStore = this.store.of('playerItemStore')
    this.churarenPlayerStore = this.store.of('churarenPlayers')
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.clearGhostModePlayers()
    resetChurarenPlayersStore(this.store)
    resetPlayerItemStore(this.store)
  }

  private readonly changeGhostPlayer = (player: Player): void => {
    if (player === undefined) return
    this.churarenPlayerStore.ghostModePlayers.set(player.id, player)
    player.isCollidable = false
    this.deleteItems(player.id)
    if (
      this.churarenPlayerStore.ghostModePlayers.size ===
      this.gamePluginStore.games.get(this.gameId)?.participantIds.length
    ) {
      const updateChurarenUi = new ChurarenResultEvent('gameOver')
      this.bus.post(updateChurarenUi)
    }
  }

  private readonly skipDamage = (ev: LivingDamageEvent): void => {
    // TODO: ちゅられん特有の敵との衝突によるダメージのみ処理を行うように条件を追加
    if (!this.isActive) return
    const player = ev.target as Player
    if (player === undefined) return
    if (this.churarenPlayerStore.ghostModePlayers.has(player.id)) return
    if (this.inviciblePlayersList.includes(player.id)) {
      ev.cancel()
    } else {
      this.changeInvincible(player.id)
      const invicibleTimeMessage = new InvicibleTimeMessage({
        playerId: player.id,
        invicibleTime: this.INVICIBLE_TIME,
      })
      this.networkPluginStore.messageSender.send(invicibleTimeMessage)
    }
  }

  private readonly getItem = (ev: GetChurarenItemEvent): void => {
    if (this.churarenPlayerStore.ghostModePlayers.has(ev.playerId)) return
    if (this.playerItemStore.alchemyItem.get(ev.playerId) !== undefined) return
    const itemCount = this.playerItemStore.materialItems.getAllItem(ev.playerId).length
    if (itemCount >= MAX_ITEMS) return
    this.playerItemStore.materialItems.set(ev.playerId, ev.item)
    this.itemPluginStore.items.delete(ev.item.itemId)
    const getItemData: GetChurarenItemData = {
      playerId: ev.playerId,
      itemId: ev.item.id,
    }
    const getItemMessage = new GetChurarenItemMessage(getItemData)
    this.networkPluginStore.messageSender.send(getItemMessage)
  }

  private readonly dropItem = (ev: DropChurarenItemEvent): void => {
    const player = this.playerPluginStore.players.get(ev.playerId)
    if (player === undefined) return
    this.playerItemStore.materialItems.delete(player.id, ev.itemId)
  }

  private readonly onChurarenDamageFromBoss = (ev: LivingDamageEvent): void => {
    // TODO: ボスから受けたダメージをclientに送信する処理の実装

    if (!isPlayer(ev.target)) return
    const player = ev.target
    if (player.isDead) {
      this.changeGhostPlayer(player)
    }
  }

  private readonly onLivingHeal = (ev: PlayerHealEvent): void => {
    const player = this.playerPluginStore.players.get(ev.id)
    player?.heal(ev.healAmount)
  }

  private readonly onUseRevivalItem = (ev: UseRevivalItemEvent): void => {
    if (this.churarenPlayerStore.ghostModePlayers.size === 0) {
      const healAmount = 100
      const player = this.playerPluginStore.players.get(ev.playerId)
      if (player === undefined) return
      player.heal(healAmount)
      this.networkPluginStore.messageSender.send(new PlayerHealMessage({ playerId: player.id, healAmount }))
    } else {
      const revivalPlayerId = this.churarenPlayerStore.ghostModePlayers.getRandomPlayerId()
      const revivalPlayer = this.playerPluginStore.players.get(revivalPlayerId)
      if (revivalPlayer === undefined) return
      this.churarenPlayerStore.ghostModePlayers.delete(revivalPlayerId)
      revivalPlayer.isCollidable = true
      const revivalItemMessage = new PlayerRevivalMessage({ playerId: revivalPlayer.id })
      this.networkPluginStore.messageSender.send(revivalItemMessage)
    }
  }

  private clearGhostModePlayers(): void {
    this.churarenPlayerStore.ghostModePlayers.getAllId().forEach((playerId) => {
      const player = this.playerPluginStore.players.get(playerId)
      if (player === undefined) return
      player.isCollidable = true
    })
    this.churarenPlayerStore.ghostModePlayers.clear()
  }

  private deleteItems(playerId: string): void {
    this.playerItemStore.materialItems.clear(playerId)
    this.playerItemStore.alchemyItem.delete(playerId)
  }

  // 無敵のプレイヤーを追加
  private changeInvincible(playerId: string): void {
    this.inviciblePlayersList.push(playerId)
    setTimeout(() => {
      this.inviciblePlayersList.shift()
    }, this.INVICIBLE_TIME)
  }
}
