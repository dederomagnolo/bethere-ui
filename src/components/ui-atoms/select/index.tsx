import Select, { GroupBase, OptionsOrGroups } from  'react-select'

interface SelectProps {
  defaultValue?: any
  options?: any
  onChange?: Function
}

export const CustomSelect = ({ options, defaultValue, onChange }: SelectProps) => {
  return (
    <Select
      onChange={(option) => onChange && onChange(option)}
      isSearchable={false}
      defaultValue={defaultValue}
      menuPortalTarget={document.querySelector('body')}
      className='react-select-container'
      classNamePrefix='react-select'
      options={options} />
  )
}