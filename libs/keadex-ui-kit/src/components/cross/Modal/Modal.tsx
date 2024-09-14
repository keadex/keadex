import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDataAttributes } from '@keadex/keadex-utils'
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Modal as ModalTE } from 'tw-elements'
import { Size } from '../../../common'
import { Button, type ButtonProps } from '../Button/Button'

const MODAL_HIDDEN_EVENT = 'hidden.te.modal'

export interface ModalProps {
  id: string
  title: string
  body: string | JSX.Element
  buttons?: ButtonProps[] | boolean
  size?: Size
  onHiddenModal?: () => void
}

export interface ModalCommands {
  showModal: () => void
  hideModal: () => void
}

export function renderButtons(
  buttons?: ButtonProps[] | boolean,
): JSX.Element[] {
  const renderedButtons: JSX.Element[] = []
  if (typeof buttons !== 'boolean' && buttons) {
    buttons.forEach((buttonProps, index, array) => {
      const dataAttributes = getDataAttributes(buttonProps)
      renderedButtons.push(
        <Button
          {...buttonProps}
          {...dataAttributes}
          className={`${index !== 0 && array.length > 1 ? 'ml-3' : ''} ${
            buttonProps.className
          }`}
        />,
      )
    })
  }
  return renderedButtons
}

export const Modal = forwardRef(
  (props: ModalProps, ref: Ref<ModalCommands>) => {
    const { id: modalId, onHiddenModal } = props
    const size = props.size ?? 'md'
    const modalInstance = useRef<typeof ModalTE>()

    const getSize = () => {
      switch (size) {
        case 'sm':
          return 'w-[25rem]'
        case 'md':
          return 'w-[40rem]'
        case 'lg':
          return 'w-[70rem]'
        case 'full':
          return 'w-full'
      }
    }

    useEffect(() => {
      function onHiddenListener() {
        if (onHiddenModal) onHiddenModal()
      }
      const element: HTMLElement | null = document.getElementById(modalId)

      if (!modalInstance.current && element) {
        modalInstance.current = new ModalTE(element)
      }

      if (element)
        element.addEventListener(MODAL_HIDDEN_EVENT, onHiddenListener)

      return () => {
        if (element) {
          element.removeEventListener(MODAL_HIDDEN_EVENT, onHiddenListener)
        }
      }
    }, [modalId, onHiddenModal])

    useImperativeHandle(ref, () => ({
      showModal: (): void => {
        modalInstance.current.show()
      },
      hideModal: (): void => {
        modalInstance.current.hide()
        modalInstance.current = undefined
      },
    }))

    return (
      <div
        data-te-modal-init
        className="fixed left-0 top-8 bottom-0 z-[1055] hidden h-auto w-full overflow-y-auto overflow-x-hidden outline-none"
        id={modalId}
        tabIndex={-1}
        aria-labelledby={`${modalId}Label`}
      >
        <div
          data-te-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center justify-center  opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:min-h-[calc(100%-3.5rem)]"
        >
          <div
            className={`pointer-events-auto relative flex ${getSize()} ${
              props.size === 'full' ? 'mx-5' : ''
            } bg-primary flex-col rounded-md border-none bg-clip-padding text-current shadow-lg outline-none`}
          >
            <div className="border-secondary flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-opacity-50 p-4">
              {/* Modal title*/}
              <h5
                className="text-accent-primary text-xl font-medium leading-normal pointer-events-none"
                id={`${modalId}Label`}
              >
                {props.title}
              </h5>
              {/* Close button*/}
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-te-modal-dismiss
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {typeof props.buttons !== 'boolean' && (
              <>
                {/* Modal body */}
                <div className="modal__body">{props.body}</div>

                {/* Modal footer */}
                <div className="modal__footer">
                  {renderButtons(props.buttons)}
                </div>
              </>
            )}
            {typeof props.buttons === 'boolean' && props.body}
          </div>
        </div>
      </div>
    )
  },
)

export default Modal
