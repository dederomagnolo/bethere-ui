import Select, { GroupBase, OptionsOrGroups } from  'react-select'

interface SelectProps {
  defaultValue?: any
  options?: any
  onChange?: Function,
  value?: any
}

export const CustomSelect = ({ options, defaultValue, onChange, value }: SelectProps) => {
  return (
    <Select
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