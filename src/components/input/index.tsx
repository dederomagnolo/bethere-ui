import React, { ChangeEventHandler } from 'react'

import './styles.scss'

interface InputProps {
  onChange: ChangeEventHandler
  placeholder?: string
  name?: string
  className?: string,
  value?: string,
  autoFocus?: boolean
}

export const Input: React.FC<InputProps> = ({
  onChange,
  placeholder,
  name,
  className,
  value,
  autoFocus
}) => {
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      className={`app-input ${className}`}
      name={name}
      placeholder={placeholder}
      onChange={(e: any) => onChange(e)} />
  )
}