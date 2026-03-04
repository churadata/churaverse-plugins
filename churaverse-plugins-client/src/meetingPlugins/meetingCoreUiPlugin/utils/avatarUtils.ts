const AVATAR_COLORS = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#673ab7', '#e91e63', '#00bcd4']

export function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}
