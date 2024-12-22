export const ENV_SETTINGS = {
  AI_ENABLED: JSON.parse(import.meta.env.VITE_AI_ENABLED) as boolean,
  WEB_MODE: JSON.parse(import.meta.env.VITE_WEB_MODE) as boolean,
}
