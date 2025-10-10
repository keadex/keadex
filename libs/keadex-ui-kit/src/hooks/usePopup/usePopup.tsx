import { useCallback } from 'react'

export interface PopupOptions {
  width?: number
  height?: number
}

/**
 * Opens a popup window and waits for a postMessage result.
 */
export function usePopup() {
  const openPopup = useCallback(
    (url: string, options: PopupOptions = {}): Promise<any> => {
      return new Promise((resolve, reject) => {
        const width = options.width ?? 500
        const height = options.height ?? 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        // Open popup
        const popup = window.open(
          url,
          'popup',
          `width=${width},height=${height},left=${left},top=${top}`,
        )

        if (!popup) {
          reject(new Error('Popup blocked'))
          return
        }

        // Message listener
        const handleMessage = (event: MessageEvent) => {
          // Optional: security check
          if (event.origin !== window.location.origin) return

          resolve(event.data)
          cleanup()
        }

        window.addEventListener('message', handleMessage)

        // Poll for popup close
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer)
            // reject(new Error('Popup closed by user'))
            resolve(undefined) // resolve to undefined instead of rejecting
            cleanup()
          }
        }, 500)

        const cleanup = () => {
          window.removeEventListener('message', handleMessage)
          clearInterval(timer)
          if (!popup.closed) popup.close()
        }
      })
    },
    [],
  )

  return openPopup
}
