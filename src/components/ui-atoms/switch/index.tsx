import Switch from 'react-switch'

interface SwitchProps {
  checked: boolean
  onChange: Function,
  disabled?: boolean
}

export const Toggle = ({
  onChange,
  checked,
  disabled
}: SwitchProps) => {
  return (
    <Switch
      disabled={disabled}
      boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      checked={checked}
      onChange={() => onChange && onChange()}
    />
  )
}