import { Button, Input } from '@keadex/keadex-ui-kit/cross'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import RemoteDiagramViewer from '../../components/RemoteDiagramViewer/RemoteDiagramViewer'
import { generateRemoteDiagramDeepLink } from '../../helper/deep-link-helper'
import { generateRemoteDiagramSSRLink } from '../../helper/ssr-link-helper'

export type RemoteDiagramsParams = {
  projectRootUrl?: string
  diagramUrl?: string
  ghToken?: string
}

/* eslint-disable-next-line */
export interface RemoteDiagramsProps {}

export const RemoteDiagrams = (props: RemoteDiagramsProps) => {
  const { t } = useTranslation()

  const decodeParams = (params: RemoteDiagramsParams): RemoteDiagramsParams => {
    return {
      projectRootUrl: params.projectRootUrl
        ? atob(params.projectRootUrl)
        : undefined,
      diagramUrl: params.diagramUrl ? atob(params.diagramUrl) : undefined,
      ghToken: params.ghToken,
    }
  }

  const {
    projectRootUrl: projectRootUrlParam,
    diagramUrl: diagramUrlParam,
    ghToken: ghTokenParam,
  } = decodeParams(useParams<RemoteDiagramsParams>())

  const [projectRootUrl, setProjectRootUrl] = useState(
    !projectRootUrlParam || projectRootUrlParam.replace(/ /g, '').length === 0
      ? 'https://raw.githubusercontent.com/keadex/keadex/main/apps/keadex-diagrams'
      : projectRootUrlParam,
  )
  const [diagramUrl, setDiagramUrl] = useState(
    !diagramUrlParam || diagramUrlParam.replace(/ /g, '').length === 0
      ? 'https://raw.githubusercontent.com/keadex/keadex/main/apps/keadex-diagrams/diagrams/container/keadex-mina'
      : diagramUrlParam,
  )
  const [ghToken, setGhToken] = useState(
    !ghTokenParam || ghTokenParam.replace(/ /g, '').length === 0
      ? ''
      : ghTokenParam,
  )

  const [projectRootUrlRendered, setProjectRootUrlRendered] =
    useState(projectRootUrl)
  const [diagramUrlRendered, setDiagramUrlRendered] = useState(diagramUrl)
  const [ghTokenRendered, setGhTokenRendered] = useState(ghToken)

  function isButtonDisabled() {
    return (
      projectRootUrl.replace(/ /g, '').length === 0 ||
      diagramUrl.replace(/ /g, '').length === 0
    )
  }

  function renderDiagram(
    projectRootUrl: string | undefined,
    diagramUrl: string | undefined,
    ghToken: string | undefined,
  ) {
    if (projectRootUrl && diagramUrl) {
      setProjectRootUrlRendered(projectRootUrl)
      setDiagramUrlRendered(diagramUrl)
      if (ghToken) setGhTokenRendered(ghToken)
    }
  }

  function handleCopyLinkClick(type: 'deep-link' | 'ssr-link') {
    const generateLink =
      type === 'deep-link'
        ? generateRemoteDiagramDeepLink
        : generateRemoteDiagramSSRLink
    if (projectRootUrl && diagramUrl) {
      const link = generateLink(projectRootUrl, diagramUrl, ghToken)
      writeText(link)
      toast.info(t('remote_diagrams.link_copied'))
      if (ghToken)
        toast.warn(t('remote_diagrams.gh_token_copy_warning'), {
          autoClose: false,
        })
    }
  }

  useEffect(() => {
    renderDiagram(projectRootUrl, diagramUrl, ghToken)
  }, [])

  useEffect(() => {
    if (projectRootUrlParam) setProjectRootUrl(projectRootUrlParam)
    if (diagramUrlParam) setDiagramUrl(diagramUrlParam)
    if (ghTokenParam) setGhToken(ghTokenParam)
    renderDiagram(projectRootUrlParam, diagramUrlParam, ghTokenParam)
  }, [projectRootUrlParam, diagramUrlParam, ghTokenParam])

  return (
    <div className={`w-full min-h-full p-3 flex flex-col`}>
      <div
        className={`text-accent-primary inline-block text-2xl font-bold pointer-events-none mt-2`}
      >
        {t('remote_diagrams.title')}
      </div>
      <div className="w-full mt-5">{t('remote_diagrams.description')}</div>
      <div className={`w-full mt-10 flex flex-col`}>
        <Input
          value={projectRootUrl}
          onChange={(e) => setProjectRootUrl(e.target.value)}
          label={`${t('remote_diagrams.project_root_url')}*`}
          info={`*${t('common.required')}`}
        />
        <Input
          value={diagramUrl}
          onChange={(e) => setDiagramUrl(e.target.value)}
          label={`${t('remote_diagrams.diagram_url')}*`}
          info={`*${t('common.required')}`}
          classNameRoot="mt-5"
        />
        <Input
          value={ghToken}
          onChange={(e) => setGhToken(e.target.value)}
          label={t('common.github_token')}
          info={t('remote_diagrams.gh_token_info')}
          classNameRoot="mt-5"
        />
        <div className="flex flex-col md:flex-row mx-auto mt-5">
          <Button
            disabled={isButtonDisabled()}
            className="mr-2 w-48"
            onClick={() => renderDiagram(projectRootUrl, diagramUrl, ghToken)}
          >
            {t('common.render')}
          </Button>
          <Button
            disabled={isButtonDisabled()}
            className="mr-2 w-48"
            onClick={() => handleCopyLinkClick('deep-link')}
          >
            {t('common.action.copy_deep_link')}
          </Button>
          <Button
            disabled={isButtonDisabled()}
            className="w-48"
            onClick={() => handleCopyLinkClick('ssr-link')}
          >
            {t('common.action.copy_ssr_link')}
          </Button>
        </div>
        <div className="w-full h-[50rem] mt-14 bg-white">
          <RemoteDiagramViewer
            projectRootUrl={projectRootUrlRendered}
            diagramUrl={diagramUrlRendered}
            ghToken={ghTokenRendered}
          />
        </div>
      </div>
    </div>
  )
}

export default RemoteDiagrams
