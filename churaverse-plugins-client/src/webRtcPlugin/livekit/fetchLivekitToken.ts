import { getChuraverseConfig } from 'churaverse-engine-client'

interface AccessTokenResponse {
  token: string
}

export async function fetchLivekitToken(roomName: string, userName: string, displayName?: string): Promise<string> {
  const backendUrl = getChuraverseConfig().backendLivekitUrl
  const queryParams = new URLSearchParams({ roomName, userName })
  if (displayName !== undefined) {
    queryParams.set('displayName', displayName)
  }
  const res = await fetch(`${backendUrl}/?${queryParams.toString()}`)
  if (!res.ok) {
    throw new Error(`Failed to get access token: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as AccessTokenResponse
  return data.token
}
