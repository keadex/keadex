'use client'

import { Button, Input } from '@keadex/keadex-ui-kit/cross'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { PropsWithChildren, memo, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from '../../app/i18n/client'
import { MinaReactProps } from '@keadex/mina-react-npm/src/components/MinaReact/MinaReact'

export const MinaReact = dynamic(() => import('@keadex/mina-react-npm'), {
  ssr: false,
})

const MemoizedMinaReact = memo((props: MinaReactProps) => {
  return (
    <MinaReact
      projectRootUrl={props.projectRootUrl}
      diagramUrl={props.diagramUrl}
      ghToken={props.ghToken}
    />
  )
})
MemoizedMinaReact.displayName = 'MinaReact'

export type MinaShareDiagramProps = {
  lang: string
  className?: string
}

const PROJECT_ROOT_URL_PARAM_NAME = 'projectRootUrl'
const DIAGRAM_URL_PARAM_NAME = 'diagramUrl'
const GH_TOKEN_PARAM_NAME = 'ghToken'

export default function MinaShareDiagram({
  children,
  lang,
  className,
}: PropsWithChildren<MinaShareDiagramProps>) {
  const { t } = useTranslation(lang)
  const searchParams = useSearchParams()

  const projectRootUrlParam = searchParams?.get(PROJECT_ROOT_URL_PARAM_NAME)
  const diagramUrlParam = searchParams?.get(DIAGRAM_URL_PARAM_NAME)
  const ghTolenParam = searchParams?.get(GH_TOKEN_PARAM_NAME)

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
    !ghTolenParam || ghTolenParam.replace(/ /g, '').length === 0
      ? ''
      : ghTolenParam,
  )

  const [projectRootUrlRendered, setProjectRootUrlRendered] = useState('')
  const [diagramUrlRendered, setDiagramUrlRendered] = useState('')
  const [ghTokenRendered, setGhTokenRendered] = useState('')

  function isButtonDisabled() {
    return (
      projectRootUrl.replace(/ /g, '').length === 0 ||
      diagramUrl.replace(/ /g, '').length === 0
    )
  }

  function renderDiagram() {
    if (projectRootUrl && diagramUrl) {
      setProjectRootUrlRendered(projectRootUrl)
      setDiagramUrlRendered(diagramUrl)
      setGhTokenRendered(ghToken)
    }
  }

  function handleCopyLinkClick() {
    if (projectRootUrl && diagramUrl) {
      const projectRootUrlParam = `${PROJECT_ROOT_URL_PARAM_NAME}=${encodeURI(
        projectRootUrl,
      )}`
      const diagramUrlParam = `&${DIAGRAM_URL_PARAM_NAME}=${encodeURI(
        diagramUrl,
      )}`
      const ghTokenParam = `&${GH_TOKEN_PARAM_NAME}=${ghToken}`
      const link = `${window.location.origin}${
        window.location.pathname
      }?${projectRootUrlParam}${diagramUrlParam}${ghToken ? ghTokenParam : ''}`
      navigator.clipboard.writeText(link)
      toast.info(t('keadex_mina.share_diagram.link_copied'))
      if (ghToken)
        toast.warn(t('keadex_mina.share_diagram.gh_token_copy_warning'), {
          autoClose: false,
        })
    }
  }

  useEffect(() => {
    renderDiagram()
  }, [])

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <Input
        value={projectRootUrl}
        onChange={(e) => setProjectRootUrl(e.target.value)}
        label={`${t('keadex_mina.share_diagram.project_root_url')}*`}
        info={`*${t('common.required')}`}
      />
      <Input
        value={diagramUrl}
        onChange={(e) => setDiagramUrl(e.target.value)}
        label={`${t('keadex_mina.share_diagram.diagram_url')}*`}
        info={`*${t('common.required')}`}
        classNameRoot="mt-5"
      />
      <Input
        value={ghToken}
        onChange={(e) => setGhToken(e.target.value)}
        label={t('common.gh_token')}
        info={t('keadex_mina.share_diagram.gh_token_info')}
        classNameRoot="mt-5"
      />
      <div className="flex flex-col md:flex-row mx-auto mt-5">
        <Button
          disabled={isButtonDisabled()}
          className="mr-0 md:mr-2 w-40"
          onClick={() => renderDiagram()}
        >
          {t('common.render')}
        </Button>
        <Button
          disabled={isButtonDisabled()}
          className="mt-2 md:mt-0 w-40"
          onClick={handleCopyLinkClick}
        >
          {t('keadex_mina.share_diagram.copy_link_to_share')}
        </Button>
      </div>
      <div className="w-full h-[50rem] mt-14 bg-white">
        <MemoizedMinaReact
          projectRootUrl={projectRootUrlRendered}
          diagramUrl={diagramUrlRendered}
          ghToken={ghTokenRendered}
        />
      </div>
    </div>
  )
}
