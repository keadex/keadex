import { Diagram, DiagramListener } from '@keadex/c4-model-ui-kit'
import { useEffect, useRef, useState } from 'react'
import {
  diagram_plantuml_url_from_diagram_url,
  diagram_spec_url_from_diagram_url,
  diagram_url_from_link_string,
  open_diagram,
} from '../../../src-rust/pkg'
import {
  DiagramDesignView,
  DiagramDesignViewCommands,
} from '@keadex/keadex-mina/src/views/DiagramEditor/DiagramDesignView/DiagramDesignView'
import {
  ContextMenu,
  DropdownMenu,
  DropdownMenuItemProps,
  useAppBootstrap,
} from '@keadex/keadex-ui-kit/cross'
import '../../styles/index.css'

export interface MinaReactProps {
  projectRootUrl: string
  diagramUrl: string
}

export const MinaReact = (props: MinaReactProps) => {
  const { projectRootUrl, diagramUrl } = props

  async function initializeTailwindElements() {
    const { initTE, Dropdown } = await import('tw-elements')
    await initTE({ Dropdown })
  }

  useAppBootstrap({ initTE: initializeTailwindElements })

  const diagramDesignViewRef = useRef<DiagramDesignViewCommands>(null)
  const [diagram, setDiagram] = useState<Diagram | null>()
  const [error, setError] = useState<string | null>()

  const listener: DiagramListener = {
    onOpenDiagramClick: (link) => {
      let diagramUrl
      try {
        diagramUrl = diagram_url_from_link_string(projectRootUrl, link)
      } catch (e) {
        console.error(e)
        setError(
          'Invalid URL: the provided URL is an invalid Mina project or diagram.',
        )
      }
      if (diagramUrl) openDiagram(diagramUrl)
    },
  }

  async function openDiagram(url: string) {
    diagramDesignViewRef.current?.resetCanvas()
    let plantumlUrl
    let specUrl
    try {
      plantumlUrl = diagram_plantuml_url_from_diagram_url(projectRootUrl, url)
      specUrl = diagram_spec_url_from_diagram_url(projectRootUrl, url)
    } catch (e) {
      console.error(e)
      setError(
        'Invalid URL: the provided URL is an invalid Mina project or diagram.',
      )
    }

    if (plantumlUrl && specUrl) {
      let plantuml
      let spec
      try {
        const plantumlResponse = await fetch(plantumlUrl)
        const specResponse = await fetch(specUrl)
        if (plantumlResponse.ok && specResponse.ok) {
          plantuml = await plantumlResponse.text()
          spec = await specResponse.text()
        } else {
          throw new Error()
        }
      } catch (e) {
        setError('Diagram not found. Check the provided URL.')
      }

      if (plantuml && spec) {
        try {
          setDiagram(
            open_diagram(projectRootUrl, url, plantuml, spec) as Diagram,
          )
        } catch (e) {
          setError('Invalid diagram.')
        }
      }
    }
  }

  useEffect(() => {
    setError(null)
    openDiagram(diagramUrl)
  }, [diagramUrl])

  const menuItems: DropdownMenuItemProps[] = [
    {
      id: 'dropdown-init',
      label: '',
      isHeaderMenuItem: true,
      subMenuItems: [
        {
          id: `dropdown-init-1`,
          label: '',
        },
      ],
    },
  ]

  return (
    <div className="h-full w-full border-t flex items-center">
      <DropdownMenu menuItemsProps={menuItems} className="hidden" />
      <ContextMenu />
      {error === null && diagram && (
        <DiagramDesignView
          diagramListener={listener}
          diagram={diagram}
          ref={diagramDesignViewRef}
          readOnly
        />
      )}
      {error && <div className="w-full text-center text-black">{error}</div>}
    </div>
  )
}

export default MinaReact
