import type { InvokeArgs } from '@tauri-apps/api/core'
import * as minaWasm from '../../src-rust/pkg/'

export async function invokeWasmFunction<T>(
  functionName: string,
  args?: InvokeArgs,
): Promise<T> {
  console.debug(`Invoking wasm function:`)
  console.debug(`\t- Name: ${functionName}`)
  console.debug(`\t- Args:`)
  console.debug(args)

  // Retrieve WASM function
  const wasmFunction = (minaWasm as any)[functionName]
  if (wasmFunction === undefined) {
    const error = `Wasm function "${functionName}" not found`
    console.error(error)
    throw new Error(error)
  }

  // Process WASM function args
  let arrayArgs = []
  if (args) arrayArgs = Object.values(args)

  const result = Reflect.apply(wasmFunction, undefined, arrayArgs)

  return Promise.resolve(result as T)
}
