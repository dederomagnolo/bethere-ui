import React, { 
  useState,
  ChangeEventHandler,
  InputHTMLAttributes,
  FocusEventHandler
} from 'react'

import { 
  BsFillEyeFill as EyeIcon,
  BsEyeSlashFill as SlashedEyeIcon
} from 'react-icons/bs'

import './styles.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeEventHandler
  onBlur?: FocusEventHandler,
  placeholder?: string
  name?: string
  className?: string
  value?: string | number
  autoFocus?: boolean
  disabled?: boolean
  type?: string
  Icon?: React.FunctionComponent<{ className: string }>
  iconCustomClassName?: string
  initialValue?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  error,
  onBlur,
  onChange,
  placeholder,
  name,
  className,
  value,
  disabled,
  type,
  Icon,
  iconCustomClassName,
  inputMode,
  min,
  pattern
}) => {
  const showEyeIcon = type === 'password'
  const [inputType, setInputType] = useState(type)
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    if (showPassword) {
      setShowPassword(false)
      setInputType('password')
    } else {
      setShowPassword(true)
      setInputType('text')
    }
  }

  const iconProps = {
    className: `app-input__icon app-input__icon--default ${iconCustomClassName}`
  }

  const hasError = error && error !== ''

  const EyeIconType = showPassword ? SlashedEyeIcon : EyeIcon  
  return (
    <div className='app-input'>
      <div className='app-input__container'>
        {Icon ? <Icon {...iconProps} /> : null}
        <input
          onBlur={onBlur}
          pattern={pattern}
          inputMode={inputMode}
          min={min}
          type={inputType}
          disabled={disabled}
          value={value}
          className={`app-input__input-element ${className ? className : ''} ${hasError ? 'error-input' : ''}`}
          name={name}
          placeholder={placeholder}
          onChange={onChange} />
        {hasError && <span className='app-input__error-label'>
          {error}
        </span>}
        {showEyeIcon &&
          <EyeIconType 
            className='app-input__icon app-input__icon--password'
            onClick={togglePassword} />}
      </div>
    </div>
  )
}