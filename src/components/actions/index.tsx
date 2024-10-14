import { Button } from 'components'

import './styles.scss'

export const Actions = ({
  primaryButton,
  secondaryButton
}: any) => {
  return (
    <div className='app-actions'>
      <Button
        variant={primaryButton.variant}
        disabled={primaryButton.disabled}
        onClick={primaryButton.onClick}>
        {primaryButton.label}
      </Button>
      <Button
        disabled={secondaryButton.disabled}
        onClick={secondaryButton.onClick}
        variant={secondaryButton.variant}>
          {secondaryButton.label}
      </Button>
    </div>
  )
}