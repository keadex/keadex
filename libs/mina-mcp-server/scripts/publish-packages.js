// This script publishes both the main (@keadex/mina-mcp-server) and binary (@keadex/mina-mcp-server-PLATFORM-ARCH) packages to npm.
// Both the packages are built in the libs/mina-mcp-server/dist folder, more specifically in the binary and main subdirectories.
// This script must be run after the build step under the libs/mina-mcp-server folder.
// The binary package will be built according to the current platform and architecture.
// Since this script will be run in parallel on several platforms, the main package will be published multiple times, but only the first publish will succeed and the rest will fail with a "Package already exists" error, which can be safely ignored.

const { execSync } = require('child_process')
const { readFileSync } = require('fs')

const mainPackagePath = './dist/main'
const binaryPackagePath = './dist/binary'

function publishPackage(packagePath, ignoreErrors = false) {
  const packageJsonPath = `${packagePath}/package.json`
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const packageName = packageJson.name
  const packageVersion = packageJson.version
  console.log(
    `Publishing ${packageName}@${packageVersion} from ${packagePath}...`,
  )
  try {
    execSync(
      `npm publish ${packagePath} --access public --registry "https://registry.npmjs.org/"`,
      { stdio: 'inherit' },
    )
    console.log(`Successfully published ${packageName}@${packageVersion}`)
  } catch (error) {
    console.error(
      `Failed to publish ${packageName}@${packageVersion}: ${error.message}`,
    )
    if (!ignoreErrors) {
      process.exit(1)
    }
  }
}

// Publish the main package
publishPackage(mainPackagePath, true) // Ignore errors for the main package since it will be published multiple times in parallel and only the first publish will succeed

// Publish the binary package
publishPackage(binaryPackagePath)
