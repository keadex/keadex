/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_AI_ENABLED: string
  readonly VITE_WEB_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
