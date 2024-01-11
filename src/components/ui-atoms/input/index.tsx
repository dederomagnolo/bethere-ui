import React, { 
  useState,
  ChangeEventHandler,
  InputHTMLAttributes
} from 'react'

import { 
  BsFillEyeFill as EyeIcon,
  BsEyeSlashFill as SlashedEyeIcon
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
  Icon?: React.FunctionComponent
  iconCustomClassName?: string,
  initialValue?: string
}

export const Input: React.FC<InputProps> = ({
  onChange,
  placeholder,
  name,
  className,
  value,
  disabled,
  type,
  Icon,
  iconCustomClassName
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
  } as any // preciso entender melhor, dndo erro em intrinsic attributes

  const EyeIconType = showPassword ? SlashedEyeIcon : EyeIcon  
  return (
    <div className='app-input'>
      {Icon ? <Icon {...iconProps} /> : null}
      <input
      type={inputType}
      disabled={disabled}
      value={value}
      className={`app-input__input-element ${className ? className : ''}`}
      name={name}
      placeholder={placeholder}
      onChange={onChange} />
      {showEyeIcon &&
        <EyeIconType 
          className='app-input__icon app-input__icon--password'
          onClick={togglePassword} />}
    </div>
  )
}