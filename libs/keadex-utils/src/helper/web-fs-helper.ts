export const OPFS_TEMP_DIR_NAME = 'temp'

export function isWebFsSupported(obj: any & Window): boolean {
  return typeof obj?.showDirectoryPicker === 'function'
}

export async function getOPFSTempDir(): Promise<FileSystemDirectoryHandle> {
  // sandboxed, persistent per-origin storage
  const root = await navigator.storage.getDirectory()
  // Create a temporary directory
  const tempDir = await root.getDirectoryHandle(OPFS_TEMP_DIR_NAME, {
    create: true,
  })
  return tempDir
}

export async function clearOPFSTempDir(): Promise<void> {
  const root = await navigator.storage.getDirectory()
  if (await root.getDirectoryHandle(OPFS_TEMP_DIR_NAME).catch(() => false)) {
    console.debug('Clearing OPFS temp directory...')
    await root
      .removeEntry(OPFS_TEMP_DIR_NAME, { recursive: true })
      .catch((err) => {
        console.debug(
          `Entry "${OPFS_TEMP_DIR_NAME}" not found, nothing to clear.`,
        )
      })
  }
}

// Helper to recursively create subdirectories
export async function ensureDir(
  root: FileSystemDirectoryHandle,
  path: string[],
): Promise<FileSystemDirectoryHandle> {
  let dir = root
  for (const part of path) {
    dir = await dir.getDirectoryHandle(part, { create: true })
  }
  return dir
}

export async function printDirectoryStructure(
  dirHandle: FileSystemDirectoryHandle,
  indent = '',
) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'directory') {
      console.log(`${indent}📂 ${entry.name}`)
      // Recurse into subdirectory
      await printDirectoryStructure(entry, indent + '  ')
    } else if (entry.kind === 'file') {
      console.log(`${indent}📄 ${entry.name}`)
    }
  }
}
