import { memo } from 'react';

export const MODAL_ROOT_ID = 'modalRoot'

export const ModalRoot = memo(() => {
  return <div id={MODAL_ROOT_ID}></div>
})

export default ModalRoot
