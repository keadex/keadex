import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, readProjectConfiguration } from '@nx/devkit'

import { apiDocsGenerator } from './generator'
import { ApiDocsGeneratorSchema } from './schema'

describe('api-docs-generator generator', () => {
  let tree: Tree
  const options: ApiDocsGeneratorSchema = { project: 'test' }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await apiDocsGenerator(tree, options)
    const config = readProjectConfiguration(tree, 'test')
    expect(config).toBeDefined()
  })
})
