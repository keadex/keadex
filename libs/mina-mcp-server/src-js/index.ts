#!/usr/bin/env node

import { spawn } from 'child_process'
import path from 'path'

function getBinaryPath() {
  const platform = process.platform // 'linux', 'darwin', 'win32'
  const arch = process.arch // 'x64', 'arm64'

  const pkgName = `@keadex/mina-mcp-server-${platform}-${arch}`

  try {
    // Resolves to the platform package's directory
    const pkg = eval('require').resolve(`${pkgName}/package.json`)
    const pkgDir = path.dirname(pkg)
    const binaryName =
      platform === 'win32' ? 'mina-mcp-server.exe' : 'mina-mcp-server'
    return path.join(pkgDir, binaryName)
  } catch {
    throw new Error(`Unsupported platform: ${platform}-${arch}`)
  }
}

const binaryPath = getBinaryPath()

// Now spawn it as your Rust MCP server process
const server = spawn(binaryPath, [], {
  stdio: 'inherit', // pipe stdin/stdout/stderr straight through to the MCP client
})

server.on('error', (err) => {
  console.error(`Failed to start mina-mcp-server: ${err.message}`)
  process.exit(1)
})

server.on('exit', (code) => {
  process.exit(code ?? 0)
})

// Forward signals to the child process
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
for (const sig of signals) {
  process.on(sig, () => server.kill(sig))
}
