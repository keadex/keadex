import { render } from '@testing-library/react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import WindowTitlebarButton from './WindowTitlebarButton'

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <WindowTitlebarButton icon={faXmark} id={''} />
    )
    expect(baseElement).toBeTruthy()
  })
})
