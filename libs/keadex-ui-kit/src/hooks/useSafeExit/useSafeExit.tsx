import { Routes, useModal } from '@keadex/keadex-ui-kit/cross'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function useSafeExit(routes: Routes) {
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
            children: <span>{t('common.confirm')}</span>,
            className: 'button--dangerous',
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
