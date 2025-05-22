import { Button, Input } from '@keadex/keadex-ui-kit/cross'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { generateExternalDiagramDeepLink } from '../../helper/deep-link-helper'
import ExternalDiagramViewer from '../../components/ExternalDiagramViewer/ExternalDiagramViewer'

export type ExternalDiagramsParams = {
  projectRootUrl?: string
  diagramUrl?: string
  ghToken?: string
}

/* eslint-disable-next-line */
export interface ExternalDiagramsProps {}

export const ExternalDiagrams = (props: ExternalDiagramsProps) => {
  const { t } = useTranslation()

  const {
    projectRootUrl: projectRootUrlParam,
    diagramUrl: diagramUrlParam,
    ghToken: ghTokenParam,
  } = useParams<ExternalDiagramsParams>()

  const [projectRootUrl, setProjectRootUrl] = useState(
    !projectRootUrlParam || projectRootUrlParam.replace(/ /g, '').length === 0
      ? 'https://raw.githubusercontent.com/keadex/keadex/main/apps/keadex-diagrams'
      : decodeURI(projectRootUrlParam),
  )
  const [diagramUrl, setDiagramUrl] = useState(
    !diagramUrlParam || diagramUrlParam.replace(/ /g, '').length === 0
      ? 'https://raw.githubusercontent.com/keadex/keadex/main/apps/keadex-diagrams/diagrams/container/keadex-mina'
      : decodeURI(diagramUrlParam),
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

  function handleCopyLinkClick() {
    if (projectRootUrl && diagramUrl) {
      const link = generateExternalDiagramDeepLink(
        projectRootUrl,
        diagramUrl,
        ghToken,
      )
      writeText(link)
      toast.info(t('external_diagrams.link_copied'))
      if (ghToken)
        toast.warn(t('external_diagrams.gh_token_copy_warning'), {
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
        {t('external_diagrams.title')}
      </div>
      <div className="w-full mt-5">{t('external_diagrams.description')}</div>
      <div className={`w-full mt-10 flex flex-col`}>
        <Input
          value={projectRootUrl}
          onChange={(e) => setProjectRootUrl(e.target.value)}
          label={`${t('external_diagrams.project_root_url')}*`}
          info={`*${t('common.required')}`}
        />
        <Input
          value={diagramUrl}
          onChange={(e) => setDiagramUrl(e.target.value)}
          label={`${t('external_diagrams.diagram_url')}*`}
          info={`*${t('common.required')}`}
          classNameRoot="mt-5"
        />
        <Input
          value={ghToken}
          onChange={(e) => setGhToken(e.target.value)}
          label={t('common.github_token')}
          info={t('external_diagrams.gh_token_info')}
          classNameRoot="mt-5"
        />
        <div className="flex flex-col md:flex-row mx-auto mt-5">
          <Button
            disabled={isButtonDisabled()}
            className="mr-0 md:mr-2 w-48"
            onClick={() => renderDiagram(projectRootUrl, diagramUrl, ghToken)}
          >
            {t('common.render')}
          </Button>
          <Button
            disabled={isButtonDisabled()}
            className="mt-2 md:mt-0 w-48"
            onClick={handleCopyLinkClick}
          >
            {t('external_diagrams.copy_link_to_share')}
          </Button>
        </div>
        <div className="w-full h-[50rem] mt-14 bg-white">
          <ExternalDiagramViewer
            projectRootUrl={projectRootUrlRendered}
            diagramUrl={diagramUrlRendered}
            ghToken={ghTokenRendered}
          />
        </div>
      </div>
    </div>
  )
}

export default ExternalDiagrams
