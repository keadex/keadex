import JSZip from 'jszip'
import { mkdir, writeFile } from '@tauri-apps/plugin-fs'
import { dirname, join, tempDir } from '@tauri-apps/api/path'

export async function extractToFS(zipBlob: Blob): Promise<string> {
  const zip = await JSZip.loadAsync(zipBlob)
  const root = await tempDir()

  let rootZip
  for (const [relPath, entry] of Object.entries(zip.files)) {
    const destPath = await join(root, relPath)

    if (entry.dir) {
      // Create directory
      await mkdir(destPath, { recursive: true })

      if (!rootZip) {
        rootZip = destPath
      }
    } else {
      // Ensure parent directory exists
      await mkdir(await dirname(destPath), { recursive: true })

      // Extract file content
      const content = await entry.async('uint8array')

      // Write to filesystem
      await writeFile(destPath, content)
    }
  }

  return rootZip ?? root
}
