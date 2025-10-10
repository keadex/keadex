export const ENV_SETTINGS = {
  AI_ENABLED: JSON.parse(import.meta.env.VITE_AI_ENABLED) as boolean,
  WEB_MODE: JSON.parse(import.meta.env.VITE_WEB_MODE) as boolean,
  APP_VERSION: import.meta.env.VITE_APP_VERSION as string,
  GITHUB_CLIENT_ID_MINA: import.meta.env.VITE_GITHUB_CLIENT_ID_MINA as string,
}
