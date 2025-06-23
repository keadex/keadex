import { ExecutorContext } from '@nx/devkit'

import { ReleaseKeadexProjectsExecutorSchema } from './schema'
import executor from './release-keadex-projects'

const options: ReleaseKeadexProjectsExecutorSchema = {}
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {},
  },
  projectsConfigurations: {
    projects: {},
    version: 2,
  },
  nxJsonConfiguration: {},
}

describe('ReleaseKeadexProjects Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context)
    expect(output.success).toBe(true)
  })
})
