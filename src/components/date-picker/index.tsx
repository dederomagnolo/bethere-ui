

import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './styles.scss'

export const CustomDatePicker = ({ onChange, value }: any) => {
  return (
    <div className='custom-date-picker'>
      <h1>Data</h1>
      <DatePicker
        clearIcon={null}
        onChange={onChange}
        value={value} />
    </div>
  )
}