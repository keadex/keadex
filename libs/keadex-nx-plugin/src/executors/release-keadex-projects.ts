import { PromiseExecutor } from '@nx/devkit'
import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { glob } from 'glob'
import * as matter from 'gray-matter'
import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release'

import { ReleaseKeadexProjectsExecutorSchema } from './schema'

const MULTIPLATFORM_PROJECTS = ['mina-mcp-server']

const runExecutor: PromiseExecutor<
  ReleaseKeadexProjectsExecutorSchema
> = async (options) => {
  // Check if the version plan file exists
  const versionPlans = await getVersionPlans()
  if (!versionPlans) {
    console.error('No version plans found.')
    return {
      success: false,
    }
  }
  console.info('Version plans:', versionPlans)

  // Read the version plans files and extract the projects to release
  let projectsToRelease = versionPlans.reduce((acc, versionPlan) => {
    const { data } = matter(readFileSync(versionPlan))
    const projects = Object.keys(data)
    return acc.concat(projects)
  }, [])

  // Remove mina-mcp-server from the list of projects to release, as it has a dedicated release process
  if (!options.multiplatformMode) {
    projectsToRelease = projectsToRelease.filter(
      (project) => !MULTIPLATFORM_PROJECTS.includes(project),
    )
  } else {
    projectsToRelease = projectsToRelease.filter((project) =>
      MULTIPLATFORM_PROJECTS.includes(project),
    )
  }

  if (projectsToRelease.length === 0) {
    console.error('No projects to release found in the latest version plan.')
    return {
      success: false,
    }
  }
  console.info('Projects to release:', projectsToRelease)

  let result: boolean

  // Version the projects
  try {
    console.info('Versioning the projects...')
    result = await version(projectsToRelease, options)
    if (!result) {
      console.error('Failed to version projects.')
      if (!options.multiplatformMode) {
        return {
          success: false,
        }
      }
      // In multiplatform mode, we want to continue with the release process even if versioning fails, as it might be caused by versisoning the same project multiple times, which is expected in this mode
      console.warn(
        'Continuing with the release process in multiplatform mode despite versioning failure.',
      )
    } else {
      console.info('Projects versioned successfully.')
    }
  } catch (error) {
    if (!options.multiplatformMode) {
      console.error('Unexpected error during versioning:', error)
      return {
        success: false,
      }
    } else {
      console.warn(
        'Unexpected error during versioning in multiplatform mode, continuing with the release process:',
        error,
      )
    }
  }

  // Build the projects
  console.info('Building the projects...')
  result = await buildProjects(projectsToRelease, options)
  if (!result) {
    console.error('Failed to build projects.')
    return {
      success: false,
    }
  }
  console.info('Projects built successfully.')

  // Publish the projects
  console.info('Publishing the projects...')
  result = await publish(projectsToRelease, options)
  if (!result) {
    console.error('Failed to publish projects.')
    return {
      success: false,
    }
  }
  console.info('Projects published successfully.')

  return {
    success: result,
  }
}

async function getVersionPlans(): Promise<string[] | undefined> {
  const versionPlans = await glob('.nx/version-plans/*.md', {
    stat: true,
    withFileTypes: true,
  })
  const timeSortedFiles = versionPlans
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .map((path) => path.fullpath())

  return timeSortedFiles.length > 0 ? timeSortedFiles : undefined
}

async function buildProjects(
  projects: string[],
  options: ReleaseKeadexProjectsExecutorSchema,
): Promise<boolean> {
  const command = 'yarn'
  const args = [
    'nx',
    'run-many',
    '-t',
    'build',
    '-p',
    ...projects,
    '--parallel=false',
  ]
  console.info(`Executing: ${command} ${args.join(' ')}`)

  if (!options.dryRun) {
    try {
      const child = spawn(command, args, { stdio: 'inherit', shell: true })

      return new Promise((resolve) => {
        child.on('close', (code) => {
          if (code === 0) {
            console.info('Command executed successfully.')
            resolve(true)
          } else {
            console.error(`Command failed with exit code ${code}.`)
            resolve(false)
          }
        })

        child.on('error', (error) => {
          console.error('Error executing command:', error)
          resolve(false)
        })
      })
    } catch (error) {
      console.error('Unexpected error:', error)
      return false
    }
  } else {
    console.info('Dry run mode: skipping command execution.')
    return true
  }
}

async function version(
  projects: string[],
  options: ReleaseKeadexProjectsExecutorSchema,
): Promise<boolean> {
  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    dryRun: options.dryRun,
    verbose: options.verbose,
    projects,
  })

  await releaseChangelog({
    versionData: projectsVersionData,
    version: workspaceVersion,
    dryRun: options.dryRun,
    verbose: options.verbose,
    projects,
  })
  return true
}

async function publish(
  projects: string[],
  options: ReleaseKeadexProjectsExecutorSchema,
): Promise<boolean> {
  // publishResults contains a map of project names and their exit codes
  const publishResults = await releasePublish({
    dryRun: options.dryRun,
    verbose: options.verbose,
    access: 'public',
    projects,
  })

  return Object.values(publishResults).every((result) => result.code === 0)
}

export default runExecutor
