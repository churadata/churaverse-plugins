export interface WebRtcPluginConfigOptions {
  backendLivekitUrl: string
}

declare module 'churaverse-engine-client' {
  export interface IPluginConfigOptions {
    webRtcPlugin: WebRtcPluginConfigOptions
  }
}
