import JSZip from 'jszip'
import { ensureDir, getOPFSTempDir } from './web-fs-helper'

export async function extractToOPFS(
  zipBlob: Blob,
): Promise<FileSystemDirectoryHandle> {
  const zip = await JSZip.loadAsync(zipBlob)

  // sandboxed, persistent per-origin storage
  const root = await getOPFSTempDir()

  let rootZip
  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) {
      // Create directory
      const parts = path.split('/').filter(Boolean) // remove empty parts
      if (parts.length > 0) {
        const dir = await ensureDir(root, parts)
        if (!rootZip) {
          rootZip = dir
        }
      }
    } else {
      // Create subdirectories first
      const parts = path.split('/').filter(Boolean)
      const fileName = parts.pop()!
      const parentDir = parts.length > 0 ? await ensureDir(root, parts) : root

      // Extract file content
      const content = await entry.async('blob')

      // Write file
      const handle = await parentDir.getFileHandle(fileName, { create: true })
      const writable = await handle.createWritable()
      await writable.write(content)
      await writable.close()
    }
  }

  return rootZip ?? root
}
