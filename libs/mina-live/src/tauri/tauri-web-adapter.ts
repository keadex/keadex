import type {
  InvokeArgs,
  InvokeOptions,
  invoke,
  transformCallback,
} from '@tauri-apps/api/core'
import type { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { invokeWasmFunction } from './wasm-bridge'
import { invokeTauriPlugin } from './tauri-plugin-adapter'

declare global {
  interface Window {
    __TAURI_IPC__: (message: any) => void
    __TAURI_INTERNALS__: {
      invoke: typeof invoke
      transformCallback: typeof transformCallback
    }
  }
}

window.__TAURI_IPC__ = (message: any) => {
  console.debug(`Web-Adapted Tauri IPC: ${message}`)
}

window.__TAURI_INTERNALS__ = {
  invoke: <T>(
    cmd: string,
    args?: InvokeArgs,
    options?: InvokeOptions,
  ): Promise<T> => {
    console.debug(
      `Web-Adapted Tauri Internal "invoke": ${cmd} - ${JSON.stringify(
        args,
      )} - ${JSON.stringify(options)}`,
    )
    if (!cmd.startsWith('plugin:')) {
      // It has not been invoked a Tauri plugin
      return invokeWasmFunction(cmd, args)
    } else {
      return invokeTauriPlugin(cmd, args)
    }
  },
  transformCallback: <T = unknown>(
    callback?: ((response: T) => void) | undefined,
    once?: boolean,
  ): number => {
    console.debug(`Web-Adapted Tauri Internal "transformCallback"`)
    return 0
  },
}

export function getCurrentWebviewWindow(): Partial<WebviewWindow> {
  return {
    onDragDropEvent: (handler) => {
      console.debug(`Web-Adapted Tauri WebView Window API "onDragDropEvent"`)
      return Promise.resolve(() => {
        // do nothing
      })
    },
    isMaximized: () => {
      console.debug(`Web-Adapted Tauri WebView Window API "isMaximized"`)
      return Promise.resolve(true)
    },
    listen: (event, handler) => {
      console.debug(`Web-Adapted Tauri WebView Window API "listen"`)
      return Promise.resolve(() => {
        // do nothing
      })
    },
  }
}
