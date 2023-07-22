import React, { 
  useState,
  ChangeEventHandler,
  InputHTMLAttributes
} from 'react'

import { 
  BsFillEyeFill as EyeIcon,
} from 'react-icons/bs'

import './styles.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: ChangeEventHandler
  placeholder?: string
  name?: string
  className?: string,
  value?: string,
  autoFocus?: boolean,
  disabled?: boolean,
  type?: string
}

export const Input: React.FC<InputProps> = ({
  onChange,
  placeholder,
  name,
  className,
  value,
  disabled,
  type
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

  return (
    <div className='app-input'>
      <input
      type={inputType}
      disabled={disabled}
      value={value}
      className={`app-input__input-element ${className ? className : ''}`}
      name={name}
      placeholder={placeholder}
      onChange={onChange} />
      {showEyeIcon && <EyeIcon onClick={togglePassword} />}
    </div>
  )
}