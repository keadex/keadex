import { PromiseExecutor } from '@nx/devkit'
import { ReleaseKeadexProjectsExecutorSchema } from './schema'
import { glob } from 'glob'
import * as matter from 'gray-matter'
import { readFileSync, renameSync } from 'fs'
import { spawn } from 'child_process'
import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release'

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
  const projectsToRelease = versionPlans.reduce((acc, versionPlan) => {
    const { data } = matter(readFileSync(versionPlan))
    const projects = Object.keys(data)
    return acc.concat(projects)
  }, [])

  if (projectsToRelease.length === 0) {
    console.error('No projects to release found in the latest version plan.')
    return {
      success: false,
    }
  }
  console.info('Projects to release:', projectsToRelease)

  // Version the projects
  console.info('Versioning the projects...')
  let result = await version(projectsToRelease, options)
  if (!result) {
    console.error('Failed to version projects.')
    return {
      success: false,
    }
  }
  console.info('Projects versioned successfully.')

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
  // The following line is a workaround to force Nx to use npm to publish the packages instead of yarn.
  // Nx, in fact, uses the lock file to detect the package manager: https://github.com/nrwl/nx/blob/master/packages/create-nx-workspace/src/utils/package-manager.ts#L14
  renameSync('yarn.lock', 'yarn.lock.backup')
  console.info('Publishing the projects...')
  result = await publish(projectsToRelease, options)
  renameSync('yarn.lock.backup', 'yarn.lock')
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
    projects,
  })

  return Object.values(publishResults).every((result) => result.code === 0)
}

export default runExecutor
