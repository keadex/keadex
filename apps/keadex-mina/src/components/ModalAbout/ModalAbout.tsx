import { renderButtons } from '@keadex/keadex-ui-kit/cross'
import { getTauriVersion, getVersion } from '@tauri-apps/api/app'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import {
  arch as archAPI,
  platform as platformAPI,
  type as typeAPI,
  version as versionAPI,
} from '@tauri-apps/plugin-os'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ENV_SETTINGS } from '../../core/env-settings'

type AppDetails = {
  version: string
  tauriVersion?: string
  arch?: string
  platform: string
  osType?: string
  kernelVersion?: string
}

export const ModalAbout = () => {
  const { t } = useTranslation()
  const [appDetails, setAppDetails] = useState<AppDetails | undefined>()

  const getAppDetails = async () => {
    let version, tauriVersion, arch, platform, osType, kernelVersion

    if (ENV_SETTINGS.WEB_MODE) {
      version = ENV_SETTINGS.APP_VERSION
      platform = 'web'
    } else {
      version = await getVersion()
      tauriVersion = await getTauriVersion()
      arch = await archAPI()
      platform = await platformAPI()
      osType = await typeAPI()
      kernelVersion = await versionAPI()
    }

    setAppDetails({
      version,
      tauriVersion,
      arch,
      platform,
      osType,
      kernelVersion,
    })
  }

  useEffect(() => {
    getAppDetails()
  }, [])

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body">
        {appDetails && (
          <div>
            <div className="font-bold">Keadex Mina:</div>
            <ul className="ml-2">
              <li>
                {t('common.version')}: {appDetails.version}
              </li>
              {appDetails.tauriVersion && (
                <li>
                  Tauri {t('common.version')}: {appDetails.tauriVersion}
                </li>
              )}
            </ul>
            <div className="font-bold">{t('common.system')}:</div>
            <ul className="ml-2">
              {appDetails.arch && (
                <li>
                  {t('common.architecture')}: {appDetails.arch}
                </li>
              )}
              <li>
                {t('common.platform')}: {appDetails.platform}
              </li>
              {appDetails.osType && (
                <li>
                  {t('about.os_type')}: {appDetails.osType}
                </li>
              )}
              {appDetails.kernelVersion && (
                <li>
                  {t('about.kernel_version')}: {appDetails.kernelVersion}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Modal footer */}
      <div className="modal__footer">
        {renderButtons([
          {
            key: 'button-copy',
            children: <span>{t('common.copy')}</span>,
            onClick: () => {
              writeText(JSON.stringify(appDetails, null, 2))
              toast.info(t('common.info.copied_to_clipboard'))
            },
          },
          {
            key: 'button-ok',
            children: <span>Ok</span>,
            'data-te-modal-dismiss': true,
          },
        ])}
      </div>
    </div>
  )
}

export default ModalAbout
