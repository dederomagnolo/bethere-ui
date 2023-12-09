import { useState,
  ChangeEventHandler,
  InputHTMLAttributes
} from 'react'

import './styles.scss'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeEventHandler
  inititalState?: boolean
  label: String
}

export const Checkbox: React.FC<CheckboxProps> = ({
  inititalState,
  onChange,
  label,
  className
}) => {
  const [checked, setChecked] = useState(inititalState)

  return (
    <label className={`app-checkbox ${className}`}>
      <input
      id='app-checkbox'
      className='app-checkbox__input'
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        onChange && onChange(e)
        setChecked(!checked)
      }} />
      <span className='app-checkbox__checkmark' />
      {label}
    </label>
    
  )
}