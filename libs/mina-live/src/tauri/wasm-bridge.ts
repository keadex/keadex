import type { InvokeArgs } from '@tauri-apps/api/core'

const WASM_MAPPINGS = {}

export function invokeWasmFunction<T>(
  functionName: string,
  args?: InvokeArgs,
): Promise<T> {
  return Promise.resolve({} as T)
}
