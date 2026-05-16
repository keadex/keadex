import * as readline from 'readline'

import * as minaApi from '../api'

interface Request {
  id: number
  fn: keyof typeof minaApi
  args: unknown[]
}

interface Response {
  id: number
  ok: boolean
  result?: unknown
  error?: string
}

export function startBridge() {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false,
  })

  rl.on('line', async (line: string) => {
    let id: number | undefined
    try {
      const { id: reqId, fn, args } = JSON.parse(line) as Request
      id = reqId

      const fnParsed = minaApi[fn]
      if (typeof fnParsed !== 'function') {
        throw new Error(
          `"${String(fn)}" is not a function exported by @keadex/mina`,
        )
      }

      const result = await Promise.resolve(
        (fnParsed as (...a: unknown[]) => unknown)(...args),
      )

      const response: Response = { id, ok: true, result }
      process.stdout.write(`${JSON.stringify(response)}\n`)
    } catch (err) {
      const response: Response = {
        id: id ?? -1,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }
      process.stdout.write(`${JSON.stringify(response)}\n`)
    }
  })

  rl.on('close', () => {
    process.exit(0)
  })
}
