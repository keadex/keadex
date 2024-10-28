import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import semver from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let newVersion = process.argv[2]
let release = process.argv[3]

const rootRepo = join(__dirname, '../../..')

let version = JSON.parse(
  fs.readFileSync(join(__dirname, '../package.json'), 'utf8'),
).version

if (!newVersion || newVersion === 'null') {
  if (!release) {
    release = 'patch'
  }
  newVersion = semver.inc(version, release)
}

const filesToUpdate = [
  {
    path: 'apps/keadex-mina/package.json',
    pattern: `"version": "${version}"`,
  },
  {
    path: 'apps/keadex-mina/src-tauri/Cargo.lock',
    pattern: `name = "keadex_mina"\nversion = "${version}"`,
  },
  {
    path: 'apps/keadex-mina/src-tauri/Cargo.toml',
    pattern: `name = "keadex_mina"\nversion = "${version}"`,
  },
  {
    path: 'apps/keadex-mina/src-tauri/tauri.conf.json',
    pattern: `"mainBinaryName": "Keadex Mina",\n  "version": "${version}"`,
  },
  {
    path: 'libs/mina-react/src-rust/Cargo.lock',
    pattern: `name = "keadex_mina"\nversion = "${version}"`,
  },
]

filesToUpdate.forEach((file) => {
  const path = join(rootRepo, file.path)
  // Remove carriage return for windows, which uses CRLF (\r\n) instead of LF (\n)
  const data = fs.readFileSync(path).toString().replace(/\r/g, '')
  const result = data.replace(
    new RegExp(file.pattern),
    file.pattern.replace(version, newVersion),
  )
  fs.writeFileSync(path, result)
})
