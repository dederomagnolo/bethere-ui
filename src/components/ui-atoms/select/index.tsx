import { FocusEventHandler } from 'react'
import Select from  'react-select'

interface SelectProps {
  defaultValue?: any
  options?: any
  onChange?: Function,
  value?: any
  name?: string | undefined, 
  isDisabled?: boolean
  onBlur?: FocusEventHandler<HTMLInputElement>
}

export const CustomSelect = ({ 
  options, 
  defaultValue, 
  onChange, 
  value, 
  name, 
  isDisabled, 
  onBlur = () => null
}: SelectProps) => {
  return (
    <Select
      name={name}
      onBlur={(e: any) => onBlur && onBlur(e)}
      isDisabled={isDisabled}
      value={value}
      onChange={(option) => onChange && onChange(option)}
      isSearchable={false}
      defaultValue={defaultValue}
      menuPortalTarget={document.querySelector('body')}
      className='react-select-container'
      classNamePrefix='react-select'
      options={options} />
  )
}