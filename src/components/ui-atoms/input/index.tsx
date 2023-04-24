import React, { ChangeEventHandler } from 'react'

import './styles.scss'

export interface InputProps {
  onChange: ChangeEventHandler
  placeholder?: string
  name?: string
  className?: string,
  value?: string,
  autoFocus?: boolean,
  disabled?: boolean,
}

export const Input: React.FC<InputProps> = ({
  onChange,
  placeholder,
  name,
  className,
  value,
  disabled
}) => {
  return (
    <input
      disabled={disabled}
      value={value}
      className={`app-input ${className}`}
      name={name}
      placeholder={placeholder}
      onChange={onChange} />
  )
}