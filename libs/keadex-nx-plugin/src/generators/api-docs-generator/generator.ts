import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor'
import { Tree, logger } from '@nx/devkit'
import { execSync } from 'child_process'
import { renameSync } from 'fs'
import * as path from 'path'
import { ApiDocsGeneratorSchema } from './schema'
import { replaceInFile } from 'replace-in-file'

export async function apiDocsGenerator(
  tree: Tree,
  options: ApiDocsGeneratorSchema,
) {
  const success = extractAPI(tree, options)
  if (success) {
    await generateAPIDocs(tree, options)
  } else {
    throw new Error('Generation failed')
  }
}

function extractAPI(tree: Tree, options: ApiDocsGeneratorSchema) {
  const apiExtractorJsonPath: string = path.join(
    tree.root,
    options.project,
    'config/api-extractor.json',
  )

  // Load and parse the api-extractor.json file
  const extractorConfig: ExtractorConfig =
    ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath)

  // Invoke API Extractor
  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
    // Equivalent to the "--local" command-line parameter
    localBuild: true,

    // Equivalent to the "--verbose" command-line parameter
    showVerboseMessages: true,
  })

  if (extractorResult.succeeded) {
    logger.log(`API Extractor completed successfully`)
    return true
  } else {
    logger.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`,
    )
    return false
  }
}

async function generateAPIDocs(tree: Tree, options: ApiDocsGeneratorSchema) {
  const apiDocumenterOutput: string = path.join(tree.root, options.outputPath)

  const apiExtractorReportPath: string = path.join(
    tree.root,
    options.project,
    'temp',
  )
  execSync(
    `yarn api-documenter markdown --input-folder ${apiExtractorReportPath} --output-folder ${apiDocumenterOutput}`,
  )

  const success = await replaceEntryMdFile(apiDocumenterOutput, options)

  if (success) {
    logger.log(`API Documenter completed successfully`)
  } else {
    logger.log(`API Documenter failed`)
  }
  return success
}

async function replaceEntryMdFile(
  apiDocumenterOutput: string,
  options: ApiDocsGeneratorSchema,
) {
  const defaultEntryMdFile = 'index.md'

  // Rename the entry file name
  renameSync(
    path.join(apiDocumenterOutput, defaultEntryMdFile),
    path.join(apiDocumenterOutput, options.entryMdFile),
  )

  // Replace all the occurrencies of the entry file name with the given one
  const replaceOptions = {
    files: path.join(apiDocumenterOutput, '/*.md').replace(/\[lang\]/g, '*'),
    from: new RegExp(`\\(./${defaultEntryMdFile}\\)`),
    to: `(./${options.entryMdFile})`,
    glob: {
      windowsPathsNoEscape: true, //To fix paths on Windows OS when path.join() is used to create paths
    },
  }
  try {
    const results = await replaceInFile(replaceOptions)
    console.log('Entry .md file replaced')
    return true
  } catch (error) {
    console.error('Error occurred:', error)
    return false
  }
}

export default apiDocsGenerator
