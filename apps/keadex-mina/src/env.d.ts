/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_AI_ENABLED: string
  readonly VITE_WEB_MODE: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
