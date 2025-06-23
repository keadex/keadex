export function isWebFsSupported(obj: any & Window): boolean {
  return typeof obj?.showDirectoryPicker === 'function'
}
