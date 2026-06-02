const AVATAR_COLORS = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#673ab7', '#e91e63', '#00bcd4']

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
