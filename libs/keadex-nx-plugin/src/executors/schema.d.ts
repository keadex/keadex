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

  /**
   * If true, the executor will run in multiplatform mode, which means it will execute the release process on multiple platforms.
   * This is useful for ensuring that the release process works correctly on different operating systems and environments.
   * @default false
   * @example true
   */
  multiplatformMode?: boolean
}
