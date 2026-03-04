interface AccessTokenResponse {
  token: string
}

export async function fetchLivekitToken(
  backendUrl: string,
  roomName: string,
  userName: string
): Promise<string> {
  const params = { roomName, userName }
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${backendUrl}/?${query}`)
  if (!res.ok) {
    throw new Error(`Failed to get access token: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as AccessTokenResponse
  return data.token
}
