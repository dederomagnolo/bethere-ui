import { useState,
  ChangeEventHandler,
  InputHTMLAttributes
} from 'react'

import './styles.scss'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeEventHandler
  initialState?: boolean
  label: String
  radio?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  initialState,
  onChange,
  label,
  className,
  radio,
  value,
  name,
  checked,
  disabled
}) => {
  const [internalChecked, setInternalChecked] = useState(initialState)

  return (
    <label className={`app-checkbox ${className}`}>
      <input
      disabled={disabled}
      name={name}
      value={value}
      id='app-checkbox'
      className='app-checkbox__input'
      type={radio ? 'radio' : 'checkbox'}
      checked={checked !== undefined ? checked : internalChecked}
      onChange={(e) => {
        onChange && onChange(e)
        setInternalChecked(!internalChecked)
      }} />
      <span className='app-checkbox__checkmark' />
      {label}
    </label>
    
  )
}