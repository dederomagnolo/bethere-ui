import { getDeviceOptionsToSelect } from 'global/functions'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { getUserDevices } from 'redux/device/selectors'

import { CustomSelect } from '../select'

import './styles.scss'

interface DeviceSelectorProps {
  onChange?: Function
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onChange }) => {
  const userDevices = useSelector(getUserDevices)
  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const deviceSelectOptions = getDeviceOptionsToSelect(userDevices)
  const indexOfDefaultDeviceInOptions =
    _.findIndex(deviceSelectOptions, (device) => device.value === defaultDevice._id)

  return (
    <div className='device-selector'>
      <h1>Dispositivo</h1>
      <CustomSelect
        defaultValue={deviceSelectOptions[indexOfDefaultDeviceInOptions]}
        options={deviceSelectOptions} />
    </div>
  )
}