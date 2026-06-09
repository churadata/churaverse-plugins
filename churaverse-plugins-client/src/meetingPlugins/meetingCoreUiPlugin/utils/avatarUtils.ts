import heroBasic from '../assets/hero.png'
import heroRed from '../assets/hero_red.png'
import heroBlue from '../assets/hero_blue.png'
import heroBlack from '../assets/hero_black.png'
import heroGray from '../assets/hero_gray.png'

const HERO_SPRITES = [heroBasic, heroRed, heroBlue, heroBlack, heroGray]

// idを元に色を選択する。同じ id は常に同じ色を返す。
export function getAvatarColor(id: string): string {
  let hash = 5381
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// アバター画像がないときに「丸の中に2文字出す」ためのイニシャルを取得する
export function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}
