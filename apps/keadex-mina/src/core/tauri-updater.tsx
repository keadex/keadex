import { ModalProps } from '@keadex/keadex-ui-kit/cross'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { TFunction } from 'i18next'
import { toast } from 'react-toastify'

export function checkForUpdates(
  showModal: (modalContent: ModalProps) => void,
  t: TFunction<'translation', undefined>,
  toastNoUpdates: boolean,
) {
  check().then(async (update) => {
    if (update?.available) {
      showModal({
        id: 'confirmMinaUpdateModal',
        title: `${t('updater.title', { version: update.version })}`,
        body: <div className="whitespace-pre-wrap">{update.body}</div>,
        buttons: [
          {
            key: 'button-cancel',
            children: <span>{t('common.cancel')}</span>,
            'data-te-modal-dismiss': true,
          },
          {
            key: 'button-confirm',
            children: <span>{t('common.proceed')}</span>,
            className: 'button--safe',
            onClick: async () => {
              toast.info(t('updater.updating'))
              await update.downloadAndInstall()
              await relaunch()
            },
          },
        ],
      })
    } else if (toastNoUpdates) {
      toast.info(t('common.info.youre_up_to_date'))
    }
  })
}
