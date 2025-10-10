// Headers
export const KEADEX_HEADER_PREFIX = 'Keadex'
export const KEADEX_HEADERS = {
  GH_TOKEN: `${KEADEX_HEADER_PREFIX}-Gh-Token`,
  GH_AUTH: `${KEADEX_HEADER_PREFIX}-Gh-Authorization`,
  GH_URL: `${KEADEX_HEADER_PREFIX}-Gh-Url`,
  GH_REPO: `${KEADEX_HEADER_PREFIX}-Gh-Repo`,
  GH_OWNER: `${KEADEX_HEADER_PREFIX}-Gh-Owner`,
  GH_BRANCH: `${KEADEX_HEADER_PREFIX}-Gh-Branch`,
}

// Client IDs
export const KeadexClientIds = {
  MinaDesktop: 'mina_desktop',
  MinaWeb: 'mina_web',
}

// API Paths
export const APIs = {
  KeadexGitHubAuth: {
    path: `/api/github/auth/{clientId}`,
    variables: {
      clientId: 'clientId',
    },
  },
  KeadexGitHubRepoDownload: {
    path: `/api/github/repo/download`,
    headers: {
      ghToken: KEADEX_HEADERS.GH_TOKEN,
      ghRepo: KEADEX_HEADERS.GH_REPO,
      ghOwner: KEADEX_HEADERS.GH_OWNER,
      ghBranch: KEADEX_HEADERS.GH_BRANCH,
    },
  },
}

// Channels
export const KEADEX_GH_CHANNEL_NAME = 'keadex_gh_channel'
