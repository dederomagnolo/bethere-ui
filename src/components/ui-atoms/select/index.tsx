import Select from  'react-select'

export const CustomSelect = ({ options, defaultValue }: any) => {
  return (
    <Select
      isSearchable={false}
      defaultValue={defaultValue}
      menuPortalTarget={document.querySelector('body')}
      className='react-select-container'
      classNamePrefix='react-select'
      options={options} />
  )
}