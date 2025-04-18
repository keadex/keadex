import { faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { IconButton, useModal } from '@keadex/keadex-ui-kit/cross'
import { path } from '@tauri-apps/api'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import * as dialog from '@tauri-apps/plugin-dialog'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ModalCreateProject from '../../components/ModalCreateProject/ModalCreateProject'
import { HOME_PROJECT } from '../../core/router/routes'
import { useAppDispatch } from '../../core/store/hooks'
import { openProject as openProjectEvent } from '../../core/store/slices/project-slice'
import { openProject as openProjectAPI } from '../../core/tauri-rust-bridge'
import { checkForUpdates } from '../../core/tauri-updater'
import { MinaError } from '../../models/autogenerated/MinaError'

const appWindow = getCurrentWebviewWindow()

/* eslint-disable-next-line */
export interface HomeProps {}

export const Home = React.memo((props: HomeProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { modal, showModal, hideModal } = useModal()
  const [isHovering, setIsHovering] = useState(false)

  function openProject(path: string) {
    openProjectAPI(path)
      .then((project) => {
        dispatch(openProjectEvent(project))
        navigate(HOME_PROJECT)
      })
      .catch((error: MinaError) => {
        toast.error(
          t('common.error.project_not_opened', { errorMessage: error.msg }),
        )
      })
  }

  function handleOpenProject() {
    dialog.open({ directory: true }).then(async (path) => {
      if (Array.isArray(path)) toast.error(t('common.error.invalid_path'))
      else if (path) {
        openProject(path)
      }
    })
  }

  function handleCreateProject() {
    showModal({
      id: 'createProjectModal',
      title: ``,
      body: (
        <ModalCreateProject
          hideModal={hideModal}
          mode="create"
          onProjectCreated={openProject}
        />
      ),
      buttons: false,
      size: 'lg',
    })
  }

  async function isDirectory(filePath: string) {
    try {
      await path.extname(filePath)
      return false
    } catch (e) {
      return true
    }
  }

  useEffect(() => {
    const unlisten = appWindow.onDragDropEvent(async (event) => {
      if (event.payload.type === 'over') {
        setIsHovering(true)
      } else if (event.payload.type === 'drop') {
        if (
          event.payload.paths &&
          event.payload.paths.length > 0 &&
          (await isDirectory(event.payload.paths[0]))
        ) {
          openProject(event.payload.paths[0])
        }
        setIsHovering(false)
      } else {
        setIsHovering(false)
      }
    })
    checkForUpdates(showModal, t, false)
    return () => {
      if (unlisten) unlisten.then((f) => f())
    }
  }, [])

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-center ${
        isHovering ? 'border-brand1 border-solid border-4' : ''
      }`}
    >
      {modal}
      <div className="-mt-28 text-center">
        <img
          src="mina-logo-full.svg"
          width={650}
          alt="Keadex Mina Logo "
          className="inline-block pointer-events-none"
        />
      </div>
      <div className="mt-20 text-center text-5xl">
        <IconButton
          icon={faFolderOpen}
          className="mr-20"
          onClick={handleOpenProject}
        >
          <span className="text-lg">{t('home.open_project')}</span>
        </IconButton>
        <IconButton icon={faPlus} onClick={handleCreateProject}>
          <span className="text-lg">{t('home.create_project')}</span>
        </IconButton>
      </div>
    </div>
  )
})

export default Home
