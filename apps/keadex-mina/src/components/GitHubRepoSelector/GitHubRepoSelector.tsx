import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Select, usePopup } from '@keadex/keadex-ui-kit/cross'
import {
  APIs,
  KEADEX_GH_CHANNEL_NAME,
  KeadexClientIds,
  urlBuilder,
} from '@keadex/keadex-utils/api'
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { Octokit } from '@octokit/core'
import {
  RestEndpointMethodTypes,
  restEndpointMethods,
} from '@octokit/plugin-rest-endpoint-methods'
import { RequestError } from '@octokit/request-error'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppEventContext, { AppEventType } from '../../context/AppEventContext'
import { ENV_SETTINGS } from '../../core/env-settings'

type ReposResponse =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']
export type GitHubRepository =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'][0]
export type GitHubBranch =
  RestEndpointMethodTypes['repos']['listBranches']['response']['data'][0]

const RESTOctokit = Octokit.plugin(restEndpointMethods)

export interface GitHubRepoSelectorProps {
  className?: string
  onRepoSelected?: (
    repo: GitHubRepository,
    branch: string,
    token?: string,
  ) => void
}

export const GitHubRepoSelector = (props: GitHubRepoSelectorProps) => {
  const { className } = props

  const { t } = useTranslation()
  const context = useContext(AppEventContext)
  const openPopup = usePopup()
  const [ghToken, setGhToken] = useState<string | undefined>(undefined)
  const [username, setUsername] = useState<string | undefined>(undefined)
  const [repos, setRepos] = useState<ReposResponse | undefined>(undefined)
  const [branches, setBranches] = useState<
    Map<string, GitHubBranch[]> | undefined
  >(undefined)
  const [selectedBranches, setSelectedBranches] = useState<
    Record<string, string>
  >({})

  context?.useSubscription((event) => {
    if (event.type === AppEventType.GitHubTokenChanged) {
      setGhToken((event.data as { token?: string }).token)
    }
  })

  function handleLoginClick() {
    const clientId = ENV_SETTINGS.WEB_MODE
      ? KeadexClientIds.MinaWeb
      : KeadexClientIds.MinaDesktop
    openPopup(
      `https://github.com/login/oauth/authorize?client_id=${
        ENV_SETTINGS.GITHUB_CLIENT_ID_MINA
      }&scope=repo&redirect_uri=${urlBuilder(APIs.KeadexGitHubAuth.path, {
        [APIs.KeadexGitHubAuth.variables.clientId]: clientId,
      })}`,
      {
        width: 700,
      },
    )
  }

  function handleLogoutClick() {
    setUsername(undefined)
    setRepos(undefined)
    setBranches(undefined)
    setGhToken(undefined)
    context?.emit({
      type: AppEventType.GitHubTokenChanged,
      data: { token: undefined },
    })
  }

  function isLogged() {
    return !!ghToken && !!username
  }

  function getBranchesId(repoName: string) {
    return `${repoName}-branches`
  }

  async function getRepoData(ghToken?: string) {
    if (ghToken) {
      const octokit = new RESTOctokit({
        authStrategy: createOAuthUserAuth,
        auth: {
          token: ghToken,
        },
      })
      try {
        // Get user data
        const user = await octokit.rest.users.getAuthenticated()
        setUsername(user.data.login)

        // Get repos
        const repos = await octokit.rest.repos.listForAuthenticatedUser()
        setRepos(repos)

        // Get branches for each repo
        const tempBranches = new Map<string, GitHubBranch[]>()
        const tempSelectedBranches: Record<string, string> = {}
        for (const repo of repos.data) {
          const branches = await octokit.rest.repos.listBranches({
            owner: repo.owner.login,
            repo: repo.name,
          })
          tempBranches.set(getBranchesId(repo.name), branches.data)

          // Set default selected branches
          tempSelectedBranches[repo.name] = repo.default_branch
        }
        setBranches(tempBranches)
        setSelectedBranches(tempSelectedBranches)
      } catch (e: any) {
        const requestError = e as RequestError
        console.error('Error invokig GH API:', requestError.message)
      }
    }
  }

  useEffect(() => {
    if (ENV_SETTINGS.WEB_MODE) {
      const bc = new BroadcastChannel(KEADEX_GH_CHANNEL_NAME)
      bc.onmessage = (event) => {
        const { token } = event.data as { token?: string }
        if (token) {
          setGhToken(token)
        }
      }
    }
  }, [])

  useEffect(() => {
    // TODO remove ghToken check
    if (ghToken != '123') getRepoData(ghToken)
  }, [ghToken])

  return (
    <div className={`w-full h-full relative ${className ?? ''}`}>
      {/* Login/Logout buttons */}
      <div className="text-center w-full">
        <Button
          onClick={handleLoginClick}
          className={`!bg-black hover:!bg-dark-primary disabled:hover:!bg-black !text-lg normal-case ${
            isLogged() ? 'rounded-se-none rounded-ee-none' : ''
          }`}
          disabled={isLogged()}
        >
          {isLogged() ? `${t('common.hi')}, ${username}!` : t('common.login')}
        </Button>
        {isLogged() && (
          <Button
            onClick={handleLogoutClick}
            className={`!text-lg button--dangerous !min-w-0 !px-0 w-10 rounded-ss-none rounded-es-none`}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        )}
      </div>

      {/* User is logged and app is loading the repositories */}
      {isLogged() && (!repos || !branches) && (
        <div className="w-full absolute bottom-0 top-20">
          <div className="m-auto">
            {t('remote_project.loading_repos_data')}...
          </div>
        </div>
      )}

      {/* User is logged and repositories are loaded */}
      {isLogged() && repos && branches && (
        <div className="w-full absolute bottom-0 top-20">
          <div className="text-brand1 text-lg mb-3">
            {t('remote_diagrams.gh_select_repo')}
          </div>
          <div className="w-full overflow-y-auto absolute bottom-0 top-10 pr-3">
            {repos.data.length === 0 && (
              <div>{t('remote_diagrams.gh_no_repos')}</div>
            )}
            {repos.data.map((repo) => (
              <div
                key={repo.id}
                className="p-2 border-b-[0.5px] border-b-secondary last:border-b-0 hover:bg-secondary container-link flex"
              >
                <div
                  className="flex items-center grow"
                  onClick={() => {
                    props.onRepoSelected?.(
                      repo,
                      selectedBranches[repo.name],
                      ghToken,
                    )
                  }}
                >
                  {repo.name}
                </div>
                <div className="my-auto">
                  <Select
                    id={getBranchesId(repo.name)}
                    label={t('common.branch')}
                    options={
                      branches
                        .get(getBranchesId(repo.name))
                        ?.map((branch) => ({
                          value: branch.name,
                          label: branch.name,
                        }))
                        .sort() ?? []
                    }
                    className="w-40 !mt-3 !mb-2"
                    value={selectedBranches[repo.name]}
                    onChange={(value) => {
                      setSelectedBranches((prev) => ({
                        ...prev,
                        [repo.name]: value.target.value,
                      }))
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GitHubRepoSelector
