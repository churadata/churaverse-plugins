import heroBasic from '../assets/hero.png'
import heroRed from '../assets/hero_red.png'
import heroBlue from '../assets/hero_blue.png'
import heroBlack from '../assets/hero_black.png'
import heroGray from '../assets/hero_gray.png'

const HERO_SPRITES = [heroBasic, heroRed, heroBlue, heroBlack, heroGray]

export function getHeroSprite(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return HERO_SPRITES[Math.abs(hash) % HERO_SPRITES.length]
}
