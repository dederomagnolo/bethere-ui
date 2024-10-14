import { Button } from 'components'

export const Actions = ({
  primaryButton,
  secondaryButton
}: any) => {
  return (
    <div className='actions'>
      <Button
        disabled={primaryButton.disabled}
        onClick={primaryButton.onClick}>
        {primaryButton.label}
      </Button>
      <Button
        onClick={secondaryButton.onClick}
        variant={secondaryButton.variant}>
          {secondaryButton.label}
      </Button>
    </div>
  )
}