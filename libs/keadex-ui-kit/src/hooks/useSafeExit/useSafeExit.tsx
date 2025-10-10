import { Routes } from '@keadex/keadex-ui-kit/core'
import { useModal } from '@keadex/keadex-ui-kit/cross'
import { useTranslation } from 'react-i18next'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'

export function useSafeExit<T, K, D>(routes: Routes<T, K, D>) {
  const { modal, showModal, hideModal } = useModal()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  function safeExit(destination: string, navigateOptions?: NavigateOptions) {
    if (routes[location.pathname] && routes[location.pathname].protectExit) {
      showModal({
        id: 'confirmSafeExitModal',
        title: `${t('common.confirmation')}`,
        body: `${t('common.question.confirm_not_saved_changed')}`,
        buttons: [
          {
            key: 'button-cancel',
            children: <span>{t('common.cancel')}</span>,
            'data-te-modal-dismiss': true,
          },
          {
            key: 'button-confirm',
            children: <span>{t('common.info.i_saved_my_changes')}</span>,
            className: 'button--safe',
            onClick: () => {
              hideModal()
              navigate(destination, navigateOptions)
            },
          },
        ],
      })
    } else {
      navigate(destination, navigateOptions)
    }
  }

  return {
    safeExit,
    modal,
  }
}
