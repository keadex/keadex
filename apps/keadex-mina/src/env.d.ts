/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
