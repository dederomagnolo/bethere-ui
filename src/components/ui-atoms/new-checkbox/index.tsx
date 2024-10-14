import { useState,
  ChangeEventHandler,
  InputHTMLAttributes
} from 'react'

import './styles.scss'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: ChangeEventHandler
  initialState?: boolean
  label?: String
  radio?: boolean
  onToggle: ({ checked }: { checked: boolean }) => void 
}

export const NewCheckbox: React.FC<CheckboxProps> = ({
  initialState,
  label,
  className,
  radio,
  value,
  name,
  disabled,
  onToggle
}) => {
  const [internalChecked, setInternalChecked] = useState(initialState)

  return (
    <label className={`app-checkbox ${className} ${disabled ? 'app-checkbox--disabled' : ''}`}>
      <input
      disabled={disabled}
      name={name}
      value={value}
      id='app-checkbox'
      className='app-checkbox__input'
      type={radio ? 'radio' : 'checkbox'}
      checked={internalChecked}
      onChange={(e) => {
        const checked = e.target.checked
        setInternalChecked(checked)
        onToggle && onToggle({ checked })
      }} />
      <span className='app-checkbox__checkmark' />
      {label}
    </label>
  )
}