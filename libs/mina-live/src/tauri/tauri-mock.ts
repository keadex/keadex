export function mockTauri() {
  window.__TAURI_IPC__ = (message: any) => {
    console.debug(`Mocked TAURI IPC: ${message}`)
  }
}
