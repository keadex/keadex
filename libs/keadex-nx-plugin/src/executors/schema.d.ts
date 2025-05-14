export interface ReleaseKeadexProjectsExecutorSchema {
  /**
   * If true, the executor will only simulate the release process without making any changes.
   * This is useful for testing and debugging.
   * @default false
   * @example true
   */
  dryRun?: boolean

  /**
   * If true, the executor will provide detailed output about the release process.
   * This is useful for debugging and understanding what the executor is doing.
   * @default true
   * @example true
   */
  verbose?: boolean
}
