export function readCookie(property: string): string | undefined {
  const savedInfos = document.cookie.split(';')
  for (const savedInfo of savedInfos) {
    const [key, value] = savedInfo.trim().split('=')
    if (key === property) {
      return decodeURIComponent(value)
    }
  }
  return undefined
}
