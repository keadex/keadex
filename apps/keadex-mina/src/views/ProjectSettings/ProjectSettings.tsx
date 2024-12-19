import { faFolder, faUndo } from '@fortawesome/free-solid-svg-icons'
import {
  BOX,
  DIAGRAM,
  DiagramsThemeSettings,
  LEGEND,
  RELATIONSHIP,
} from '@keadex/c4-model-ui-kit'
import {
  Button,
  ColorPicker,
  IconButton,
  Input,
  Radio,
  Tab,
  Tabs,
  Textarea,
} from '@keadex/keadex-ui-kit/cross'
import * as dialog from '@tauri-apps/plugin-dialog'
import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Key } from 'ts-key-enum'
import { Tab as TWTab } from 'tw-elements'
import { AI_API_KEY, AI_BASE_URL, AI_MODEL } from '../../constants/ai'
import { NAME_REGEX, VERSION_REGEX } from '../../constants/regex'
import { useAppDispatch, useAppSelector } from '../../core/store/hooks'
import { saveProject } from '../../core/store/slices/project-slice'
import {
  createProject,
  saveProjectSettings,
} from '../../core/tauri-rust-bridge'
import { MinaError } from '../../models/autogenerated/MinaError'
import { Project } from '../../models/autogenerated/Project'
import { ProjectSettings as ProjectSettingsType } from '../../models/autogenerated/ProjectSettings'
import './ProjectSettings.css'

type DiagramsThemeConfig = {
  i18nKey: string
  settings: {
    i18nKey: string
    modelName: keyof DiagramsThemeSettings
  }[]
}

export type ProjectSettingsProps = {
  mode: 'edit' | 'create'
  hideModal?: () => void
  onProjectCreated?: (projectRoot: string) => void
}

const defaultProjectSettings: ProjectSettingsType = {
  root: '',
  name: '',
  description: '',
  version: '',
  autosave_enabled: false,
  autosave_interval_seconds: 0,
  ai_settings: {
    api_base_url: AI_BASE_URL,
    api_key: AI_API_KEY,
    model: AI_MODEL,
  },
  themes_settings: {
    diagrams_theme_settings: {
      bg_color_diagram: DIAGRAM.COLOR.BG_COLOR,
      bg_color_boundary: BOX.COLORS.BG_COLOR_BOUNDARY,
      bg_color_component: BOX.COLORS.BG_COLOR_COMPONENT,
      bg_color_component_ext: BOX.COLORS.BG_COLOR_COMPONENT_EXT,
      bg_color_container: BOX.COLORS.BG_COLOR_CONTAINER,
      bg_color_container_ext: BOX.COLORS.BG_COLOR_CONTAINER_EXT,
      bg_color_deployment_node: BOX.COLORS.BG_COLOR_DEPLOYMENT_NODE,
      bg_color_person: BOX.COLORS.BG_COLOR_SOFTWARE_SYSTEM_PERSON,
      bg_color_person_ext: BOX.COLORS.BG_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
      bg_color_relationship: RELATIONSHIP.COLORS.BG_COLOR,
      bg_color_software_system: BOX.COLORS.BG_COLOR_SOFTWARE_SYSTEM_PERSON,
      bg_color_software_system_ext:
        BOX.COLORS.BG_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
      border_color_boundary: BOX.COLORS.BORDER_COLOR_BOUNDARY,
      border_color_component: BOX.COLORS.BORDER_COLOR_COMPONENT,
      border_color_component_ext: BOX.COLORS.BORDER_COLOR_COMPONENT_EXT,
      border_color_container: BOX.COLORS.BORDER_COLOR_CONTAINER,
      border_color_container_ext: BOX.COLORS.BORDER_COLOR_CONTAINER_EXT,
      border_color_deployment_node: BOX.COLORS.BORDER_COLOR_DEPLOYMENT_NODE,
      border_color_person: BOX.COLORS.BORDER_COLOR_SOFTWARE_SYSTEM_PERSON,
      border_color_person_ext:
        BOX.COLORS.BORDER_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
      border_color_software_system:
        BOX.COLORS.BORDER_COLOR_SOFTWARE_SYSTEM_PERSON,
      border_color_software_system_ext:
        BOX.COLORS.BORDER_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
      line_color_relationship: RELATIONSHIP.COLORS.LINE_COLOR,
      text_color_boundary: BOX.COLORS.TEXT_COLOR_BOUNDARY,
      text_color_component: BOX.COLORS.TEXT_COLOR_COMPONENT,
      text_color_component_ext: BOX.COLORS.TEXT_COLOR_COMPONENT_EXT,
      text_color_container: BOX.COLORS.TEXT_COLOR_CONTAINER,
      text_color_container_ext: BOX.COLORS.TEXT_COLOR_CONTAINER_EXT,
      text_color_deployment_node: BOX.COLORS.TEXT_COLOR_DEPLOYMENT_NODE,
      text_color_legend_title: LEGEND.COLOR.TEXT_COLOR_TITLE,
      text_color_person: BOX.COLORS.TEXT_COLOR_SOFTWARE_SYSTEM_PERSON,
      text_color_person_ext: BOX.COLORS.TEXT_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
      text_color_relationship: RELATIONSHIP.COLORS.TEXT_COLOR,
      text_color_software_system: BOX.COLORS.TEXT_COLOR_SOFTWARE_SYSTEM_PERSON,
      text_color_software_system_ext:
        BOX.COLORS.TEXT_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
    },
  },
}

const emptyProjectSettings: ProjectSettingsType = {
  root: '',
  name: '',
  description: '',
  version: '',
  autosave_enabled: defaultProjectSettings.autosave_enabled,
  autosave_interval_seconds: defaultProjectSettings.autosave_interval_seconds,
}

const diagramsThemeConfigs: DiagramsThemeConfig[] = [
  {
    i18nKey: 'common.diagram',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_diagram',
      },
    ],
  },
  {
    i18nKey: 'common.legend',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_legend_title',
      },
    ],
  },
  {
    i18nKey: 'common.person',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_person',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_person',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_person',
      },
    ],
  },
  {
    i18nKey: 'common.person_external',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_person_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_person_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_person_ext',
      },
    ],
  },
  {
    i18nKey: 'common.software_system',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_software_system',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_software_system',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_software_system',
      },
    ],
  },
  {
    i18nKey: 'common.software_system_external',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_software_system_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_software_system_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_software_system_ext',
      },
    ],
  },
  {
    i18nKey: 'common.container',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_container',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_container',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_container',
      },
    ],
  },
  {
    i18nKey: 'common.container_external',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_container_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_container_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_container_ext',
      },
    ],
  },
  {
    i18nKey: 'common.component',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_component',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_component',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_component',
      },
    ],
  },
  {
    i18nKey: 'common.component_external',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_component_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_component_ext',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_component_ext',
      },
    ],
  },
  {
    i18nKey: 'common.boundary',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_boundary',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_boundary',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_boundary',
      },
    ],
  },
  {
    i18nKey: 'common.deployment_node',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_deployment_node',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.border_color',
        modelName: 'border_color_deployment_node',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_deployment_node',
      },
    ],
  },
  {
    i18nKey: 'common.relationship',
    settings: [
      {
        i18nKey: 'project_settings.themes.diagrams_theme.bg_color',
        modelName: 'bg_color_relationship',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.line_color',
        modelName: 'line_color_relationship',
      },
      {
        i18nKey: 'project_settings.themes.diagrams_theme.text_color',
        modelName: 'text_color_relationship',
      },
    ],
  },
]

export const ProjectSettings = (props: ProjectSettingsProps) => {
  const AI_ENABLED = JSON.parse(import.meta.env.VITE_AI_ENABLED)

  const project = useAppSelector((state) => state.project.value)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [newProjectSettings, setNewProjectSettings] = useState<
    ProjectSettingsType | undefined
  >(props.mode === 'edit' ? project?.project_settings : emptyProjectSettings)
  const [openResetModal, setOpenResetModal] = useState<string | undefined>()

  function chooseProjectDirectory() {
    if (newProjectSettings) {
      dialog.open({ directory: true }).then(async (path) => {
        if (Array.isArray(path)) toast.error(t('common.error.invalid_path'))
        else if (path) {
          setNewProjectSettings({
            ...newProjectSettings,
            root: path,
          })
        }
      })
    }
  }

  function checkValues(projectSettings: ProjectSettingsType) {
    if (
      projectSettings.autosave_interval_seconds !== null &&
      (projectSettings.autosave_interval_seconds < 0 ||
        projectSettings.autosave_interval_seconds > 240)
    ) {
      toast.error(
        `${t('common.invalid')} "${t('common.autosave'.toLowerCase())}" ${t(
          'common.value',
        ).toLowerCase()}`,
      )
    }
  }

  function handleConfirmClick() {
    if (newProjectSettings) {
      checkValues(newProjectSettings)
      if (props.mode === 'edit') {
        // Editing the project settings
        if (project?.project_settings) {
          const newProject: Project = {
            ...project,
            project_settings: {
              ...project?.project_settings,
              ...newProjectSettings,
            },
          }
          saveProjectSettings(newProjectSettings)
            .then((result) => {
              dispatch(saveProject(newProject))
              toast.info(t('common.info.done'))
            })
            .catch((error: MinaError) => {
              toast.error(error.msg)
            })
        }
      } else {
        // Creating a new project
        createProject(newProjectSettings)
          .then((result) => {
            toast.info(t('common.info.done'))
            if (props.hideModal) props.hideModal()
            if (props.onProjectCreated) props.onProjectCreated(result.root)
          })
          .catch((error: MinaError) => {
            toast.error(error.msg)
          })
      }
    }
  }

  function resetColor(
    type: 'reset' | 'default',
    modelName: keyof DiagramsThemeSettings,
  ) {
    if (newProjectSettings) {
      let color
      if (
        type === 'reset' &&
        project?.project_settings.themes_settings?.diagrams_theme_settings
      ) {
        color =
          project.project_settings.themes_settings.diagrams_theme_settings[
            modelName
          ]
      }
      if (!color || type === 'default') {
        color =
          defaultProjectSettings.themes_settings!.diagrams_theme_settings![
            modelName
          ]
      }

      setNewProjectSettings({
        ...newProjectSettings,
        themes_settings: {
          ...newProjectSettings.themes_settings,
          diagrams_theme_settings: {
            ...newProjectSettings.themes_settings?.diagrams_theme_settings,
            [modelName]: color,
          },
        },
      })
    }
  }

  function renderDiagramThemeSettings(
    diagramsThemeConfigs: DiagramsThemeConfig[],
  ): JSX.Element[] {
    const renderedElements: JSX.Element[] = []
    if (newProjectSettings) {
      diagramsThemeConfigs.forEach((diagramsThemeConfig) => {
        const renderedSettings: JSX.Element[] = []
        diagramsThemeConfig.settings.forEach((settings) => {
          renderedSettings.push(
            <div
              className="project-settings__diagrams-theme-settings"
              key={settings.i18nKey}
            >
              <span className="my-auto">{t(settings.i18nKey)}:</span>
              <ColorPicker
                color={
                  newProjectSettings.themes_settings?.diagrams_theme_settings?.[
                    `${settings.modelName}`
                  ] ??
                  defaultProjectSettings.themes_settings
                    ?.diagrams_theme_settings?.[`${settings.modelName}`]
                }
                onChange={(colorResult) => {
                  setNewProjectSettings({
                    ...newProjectSettings,
                    themes_settings: {
                      ...newProjectSettings.themes_settings,
                      diagrams_theme_settings: {
                        ...newProjectSettings.themes_settings
                          ?.diagrams_theme_settings,
                        [settings.modelName]: colorResult.hex,
                      },
                    },
                  })
                }}
              />
              <div>
                <IconButton
                  icon={faUndo}
                  className="ml-2"
                  onClick={() =>
                    setOpenResetModal(
                      `${diagramsThemeConfig.i18nKey}-${settings.modelName}`,
                    )
                  }
                />
                <div className="absolute pr-5 pb-5 pointer-events-none">
                  <div
                    className={`ml-2 flex flex-row bg-secondary p-2 rounded ${
                      openResetModal ===
                      `${diagramsThemeConfig.i18nKey}-${settings.modelName}`
                        ? 'flex'
                        : 'hidden'
                    }`}
                  >
                    <Button
                      className="p-1 h-fit w-[6rem] pointer-events-auto"
                      onClick={() => resetColor('reset', settings.modelName)}
                    >
                      {t('common.reset')}
                    </Button>
                    <Button
                      className="ml-2 p-1 h-fit w-[6rem] pointer-events-auto"
                      onClick={() => resetColor('default', settings.modelName)}
                    >
                      {t('common.default')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
          )
        })
        renderedElements.push(
          <div className="flex flex-col" key={diagramsThemeConfig.i18nKey}>
            <span className="mt-5 text-brand1">
              {t(diagramsThemeConfig.i18nKey)}
            </span>
            <div className="static mt-2 grid grid-cols-3 gap-x-4">
              {renderedSettings}
            </div>
          </div>,
        )
      })
    }
    return renderedElements
  }

  useEffect(() => {
    const triggerTabList: Element[] = [].slice.call(
      document.querySelectorAll('#project-settings-tabs a'),
    )
    triggerTabList.forEach((triggerEl) => {
      const tabTrigger = new TWTab(triggerEl)
      triggerEl.addEventListener('click', (e) => {
        e.preventDefault()
        tabTrigger.show()
      })
    })
  }, [])

  useHotkeys([Key.Escape], (e) => {
    if (openResetModal) {
      e.preventDefault()
      setOpenResetModal(undefined)
    }
  })

  if (newProjectSettings) {
    const tabs: Tab[] = [
      {
        id: 'project-settings-project',
        title: t('common.general'),
        body: (
          <div>
            {props.mode === 'create' && (
              <IconButton
                icon={faFolder}
                onClick={chooseProjectDirectory}
                className="flex mt-6"
                classNameIcon="mt-[3px]"
                classNameContent="ml-3"
              >
                {newProjectSettings.root.replace(/ /g, '').length > 0
                  ? newProjectSettings.root
                  : t('home.chose_parent_dir_project')}
              </IconButton>
            )}

            <Input
              type="text"
              label={`${t('common.name')}*`}
              className="mt-6"
              allowedChars={NAME_REGEX}
              info={`${t('common.allowed_pattern')}: ${NAME_REGEX}`}
              value={newProjectSettings.name}
              onChange={(e) =>
                setNewProjectSettings({
                  ...newProjectSettings,
                  name: e.target.value,
                })
              }
            />
            <Input
              type="text"
              label={`${t('common.version')}*`}
              className="mt-6"
              allowedChars={VERSION_REGEX}
              info={`${t('common.allowed_pattern')}: ${VERSION_REGEX}`}
              value={newProjectSettings.version}
              onChange={(e) =>
                setNewProjectSettings({
                  ...newProjectSettings,
                  version: e.target.value,
                })
              }
            />
            <Textarea
              label={`${t('common.description')}*`}
              className="mt-6"
              value={newProjectSettings.description}
              onChange={(e) =>
                setNewProjectSettings({
                  ...newProjectSettings,
                  description: e.target.value,
                })
              }
            />
          </div>
        ),
      },
      {
        id: 'project-settings-editor',
        title: t('common.editor'),
        body: (
          <div>
            <div className={`flex flex-row mt-6`}>
              <span>{`${t('common.autosave')}*`}:</span>
              <Radio<boolean>
                id="autosave-status"
                className="ml-5"
                value={newProjectSettings.autosave_enabled}
                options={[
                  { label: t('common.enabled'), value: true },
                  { label: t('common.disabled'), value: false },
                ]}
                onChange={(value: boolean) => {
                  setNewProjectSettings({
                    ...newProjectSettings,
                    autosave_enabled: value,
                    autosave_interval_seconds: value ? 60 : 0,
                  })
                }}
              />
            </div>
            <Input
              type="number"
              max={240}
              label={`${t('common.autosave_interval_sec')}`}
              info={`${t('common.max')} 240 ${t(
                'common.seconds',
              ).toLowerCase()}`}
              className="mt-6"
              value={
                newProjectSettings.autosave_interval_seconds !== null
                  ? newProjectSettings.autosave_interval_seconds
                  : 0
              }
              onChange={(e) => {
                setNewProjectSettings({
                  ...newProjectSettings,
                  autosave_interval_seconds:
                    e.target.value.length > 0
                      ? Number.parseInt(e.target.value)
                      : 0,
                })
              }}
            />
          </div>
        ),
      },
      {
        id: 'project-settings-diagrams-theme',
        title: t('common.themes'),
        body: (
          <div className="flex flex-col">
            <span className="text-brand1 font-bold mt-5 text-lg">
              {t('project_settings.themes.diagrams_theme.title')}
            </span>
            {renderDiagramThemeSettings(diagramsThemeConfigs)}
          </div>
        ),
      },
    ]

    if (AI_ENABLED) {
      tabs.push({
        id: 'project-settings-ai',
        title: t('common.ai'),
        body: (
          <div>
            <Input
              type="text"
              label={t('project_settings.ai.api_key')}
              info={`${t('common.example')}: ${AI_API_KEY}`}
              className="mt-6"
              value={newProjectSettings.ai_settings?.api_key ?? ''}
              onChange={(e) =>
                setNewProjectSettings({
                  ...newProjectSettings,
                  ai_settings: {
                    ...newProjectSettings.ai_settings,
                    api_key: e.target.value,
                  },
                })
              }
            />
            <Input
              type="text"
              label={t('project_settings.ai.api_base_url')}
              info={`${t('common.example')}: ${AI_BASE_URL}`}
              className="mt-6"
              value={newProjectSettings.ai_settings?.api_base_url ?? ''}
              onChange={(e) =>
                setNewProjectSettings({
                  ...newProjectSettings,
                  ai_settings: {
                    ...newProjectSettings.ai_settings,
                    api_base_url: e.target.value,
                  },
                })
              }
            />
            <Input
              type="text"
              label={t('project_settings.ai.model')}
              info={`${t('common.example')}: ${AI_MODEL}`}
              className="mt-6"
              value={newProjectSettings.ai_settings?.model ?? ''}
              onChange={(e) =>
                setNewProjectSettings({
                  ...newProjectSettings,
                  ai_settings: {
                    ...newProjectSettings.ai_settings,
                    model: e.target.value,
                  },
                })
              }
            />
          </div>
        ),
      })
    }

    return (
      <div className="w-full min-h-full p-3 relative">
        <div
          className={`top-0 bottom-0 left-0 right-0 ${
            openResetModal ? 'absolute' : 'hidden'
          }`}
          onClick={() => setOpenResetModal(undefined)}
        ></div>
        <div className="flex items-center">
          <div
            className={`text-accent-primary inline-block text-2xl font-bold pointer-events-none mt-2`}
          >
            {props.mode === 'create'
              ? t('home.create_project')
              : t(`project_settings.title`)}
          </div>
          <div className={`flex-grow`}>
            <Button
              className="float-right"
              disabled={
                !newProjectSettings.description ||
                !newProjectSettings.name ||
                !newProjectSettings.version ||
                (props.mode === 'create' && !newProjectSettings.root)
              }
              onClick={handleConfirmClick}
            >
              {props.mode === 'edit' ? t('common.save') : t('common.create')}
            </Button>
          </div>
        </div>
        <div className="w-full pb-4 pt-9">
          <Tabs
            id="project-settings-tabs"
            tabs={tabs}
            className="project-settings__tabs"
            tabClassName="!my-0 mx-1 data-[te-nav-active]:border-accent-primary data-[te-nav-active]:bg-brand1"
            bodyClassName="pt-0 flex-grow"
            orientation="top"
          />
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default ProjectSettings