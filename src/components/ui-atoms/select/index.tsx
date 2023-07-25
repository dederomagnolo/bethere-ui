import Select from  'react-select'

interface SelectProps {
  defaultValue?: any
  options?: any
  onChange?: Function,
  value?: any
  name?: string | undefined, 
  isDisabled?: boolean
}

export const CustomSelect = ({ options, defaultValue, onChange, value, name, isDisabled }: SelectProps) => {
  return (
    <Select
      isDisabled={isDisabled}
      name={name}
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