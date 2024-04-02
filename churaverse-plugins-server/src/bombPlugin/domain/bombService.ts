import { IBombRepository } from './IBombRepository'
import { BombExplosionMessage } from '../message/bombExplosionMessage'
import { IMainScene } from 'churaverse-engine-server'
import { IMessageSender } from '@churaverse/network-plugin-server/interface/IMessageSender'

/**
 * 爆弾が爆破する時間を超えているかチェックする
 */
export function checkExplode(bombs: IBombRepository): void {
  bombs.getAllId().forEach((bombId) => {
    const bomb = bombs.get(bombId)
    if (bomb?.isExplode ?? false) {
      bomb?.explode()
    }
  })
}

/**
 * 爆発済みの爆弾を削除する
 */
export function removeExplodedBomb(bombs: IBombRepository): void {
  bombs.getAllId().forEach((bombId) => {
    if (bombs.get(bombId)?.isExplode ?? false) {
      bombs.delete(bombId)
    }
  })
}

/**
 * 爆弾の爆発をfrontendに通知する
 */
export function sendExplodedBomb(messageSender: IMessageSender<IMainScene>, bombs: IBombRepository): void {
  bombs.getAllId().forEach((bombId) => {
    if (bombs.get(bombId)?.isExplode ?? false) {
      const bombExplosionMessage = new BombExplosionMessage({ bombId })
      messageSender.send(bombExplosionMessage)
    }
  })
}
