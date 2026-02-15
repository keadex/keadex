'use client'

import { ReactPortal, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Modal, { ModalCommands, ModalProps } from './Modal'
import { MODAL_ROOT_ID } from './ModalRoot'

export type ModalAPI = {
  modal: ReactPortal | undefined
  showModal: (modalContent: ModalProps) => void
  hideModal: () => void
}

export function useModal(): ModalAPI {
  const [modal, setModal] = useState<ReactPortal>()
  const [visible, setVisible] = useState(true)
  const modalRef = useRef<ModalCommands>(null)

  function showModal(modalProps: ModalProps) {
    const modalRoot = document.getElementById(MODAL_ROOT_ID)
    if (modalRoot) {
      setModal(
        createPortal(
          <Modal
            {...modalProps}
            ref={modalRef}
            onHiddenModal={() => {
              setModal(undefined)
            }}
          />,
          modalRoot,
        ),
      )
      setVisible(true)
    }
  }

  function hideModal(): void {
    setVisible(false)
  }

  useEffect(() => {
    if (modalRef.current) {
      if (visible) modalRef.current.showModal()
      else modalRef.current.hideModal()
    }
  }, [modal, visible])

  return {
    modal,
    showModal,
    hideModal,
  }
}
