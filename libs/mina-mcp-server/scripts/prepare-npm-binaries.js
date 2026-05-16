const fs = require('fs')
const path = require('path')

// Copy the compiled Rust binaries to the binaries directory for packaging
let builtPlatform = null
const basePathRustTargetRelease = path.join(
  __dirname,
  '..',
  'target',
  'release',
)
const distFolder = path.join(__dirname, '..', 'dist')
const distBinaryFolder = path.join(distFolder, 'binary')
const distMainFolder = path.join(distFolder, 'main')

const unixMinaMcpServerFileName = 'mina-mcp-server'
const winMinaMcpServerFileName = 'mina-mcp-server.exe'

const unixBinarySrc = path.join(
  basePathRustTargetRelease,
  unixMinaMcpServerFileName,
)
const windowsBinarySrc = path.join(
  basePathRustTargetRelease,
  winMinaMcpServerFileName,
)

const platforms = [
  { platform: 'linux-x64', src: unixBinarySrc },
  { platform: 'darwin-x64', src: unixBinarySrc },
  { platform: 'darwin-arm64', src: unixBinarySrc },
  { platform: 'win32-x64', src: windowsBinarySrc },
]

const binaries = platforms.map(({ platform, src }) => ({
  platform,
  src,
  dest: path.join(distBinaryFolder, path.basename(src)),
}))

for (const { src, dest, platform } of binaries) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    builtPlatform = platform
    console.log(`Copied ${src} → ${dest} (${platform})`)
    break
  }
}

// Generate the README file and package.json for the binary package, ensuring the version matches the main package.json
const sharedPackageJson = {
  version: '0.0.0',
  exports: {
    './package.json': './package.json',
  },
}
const packageJsonTemplates = {
  'linux-x64': {
    name: '@keadex/mina-mcp-server-linux-x64',
    description: 'Linux x64 binary for @keadex/mina-mcp-server',
    os: ['linux'],
    cpu: ['x64'],
    main: './mina-mcp-server',
    files: ['mina-mcp-server', 'mina.js', 'fonts'],
    ...sharedPackageJson,
  },
  'darwin-x64': {
    name: '@keadex/mina-mcp-server-darwin-x64',
    description: 'macOS x64 binary for @keadex/mina-mcp-server',
    os: ['darwin'],
    cpu: ['x64'],
    main: './mina-mcp-server',
    files: ['mina-mcp-server', 'mina.js', 'fonts'],
    ...sharedPackageJson,
  },
  'darwin-arm64': {
    name: '@keadex/mina-mcp-server-darwin-arm64',
    description: 'macOS ARM64 binary for @keadex/mina-mcp-server',
    os: ['darwin'],
    cpu: ['arm64'],
    main: './mina-mcp-server',
    files: ['mina-mcp-server', 'mina.js', 'fonts'],
    ...sharedPackageJson,
  },
  'win32-x64': {
    name: '@keadex/mina-mcp-server-win32-x64',
    description: 'Windows x64 binary for @keadex/mina-mcp-server',
    os: ['win32'],
    cpu: ['x64'],
    main: './mina-mcp-server.exe',
    files: ['mina-mcp-server.exe', 'mina.js', 'fonts'],
    ...sharedPackageJson,
  },
}

const readme = `# ${packageJsonTemplates[builtPlatform].name}

[Mina MCP Server](https://www.npmjs.com/package/@keadex/mina-mcp-server) binary for \`${builtPlatform}\``

const mainPackageJsonPath = path.join(distMainFolder, 'package.json')
const npmPackageJsonPath = path.join(distBinaryFolder, 'package.json')
const readmePath = path.join(distBinaryFolder, 'README.md')
const mainPackageJson = JSON.parse(
  fs.readFileSync(mainPackageJsonPath, 'utf-8'),
)
const npmPackageJson = packageJsonTemplates[builtPlatform]

npmPackageJson.version = mainPackageJson.version
fs.writeFileSync(npmPackageJsonPath, JSON.stringify(npmPackageJson, null, 2))
fs.writeFileSync(readmePath, readme)
console.log(
  `Created README.md and package.json with version ${mainPackageJson.version}`,
)

// Add optionalDependencies to the main package.json for the binary packages, ensuring the version matches the main package.json
const mainPackageJsonWithOptionalDeps = {
  ...mainPackageJson,
  optionalDependencies: {
    '@keadex/mina-mcp-server-linux-x64': `^${mainPackageJson.version}`,
    '@keadex/mina-mcp-server-darwin-x64': `^${mainPackageJson.version}`,
    '@keadex/mina-mcp-server-darwin-arm64': `^${mainPackageJson.version}`,
    '@keadex/mina-mcp-server-win32-x64': `^${mainPackageJson.version}`,
  },
}
fs.writeFileSync(
  mainPackageJsonPath,
  JSON.stringify(mainPackageJsonWithOptionalDeps, null, 2),
)
console.log(
  `Updated main package.json with optionalDependencies for binary packages with version ${mainPackageJson.version}`,
)

// Move the compiled WebAssembly file to the binary directory for packaging. Since the WASM filename is not deterministic, we use a glob pattern to find it and move it.
const wasmFiles = fs
  .readdirSync(distFolder)
  .filter((file) => file.endsWith('.wasm'))

if (wasmFiles.length === 0) {
  console.warn('No WASM files found in the Rust target release directory.')
} else {
  fs.copyFileSync(
    path.join(distFolder, wasmFiles[0]),
    path.join(distBinaryFolder, wasmFiles[0]),
  )
  fs.rmSync(path.join(distFolder, wasmFiles[0]))
}
