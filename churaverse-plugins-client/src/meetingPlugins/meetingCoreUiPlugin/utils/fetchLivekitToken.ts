interface AccessTokenResponse {
  token: string
}

export async function fetchLivekitToken(
  backendUrl: string,
  roomName: string,
  userName: string,
  displayName?: string
): Promise<string> {
  const queryParams = new URLSearchParams({ roomName, userName })
  if (displayName !== undefined) {
    queryParams.set('displayName', displayName)
  }
  const query = queryParams.toString()
  const res = await fetch(`${backendUrl}/?${query}`)
  if (!res.ok) {
    throw new Error(`Failed to get access token: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as AccessTokenResponse
  return data.token
}
