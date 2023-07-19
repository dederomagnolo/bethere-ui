import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

import { getUserDevices } from 'redux/device/selectors'

import { CustomSelect } from '../ui-atoms/select'

import { EditIconWithTooltip, Input } from 'components'
import { getDeviceOptionsToSelect } from 'global/functions'
import { editDeviceName, fetchUserDevices } from 'services/fetch'
import { getToken } from 'redux/user/selectors'
import { setUserDevices } from 'redux/device/actions'

import './styles.scss'

interface DeviceSelectorProps {
  onChange?: Function,
  allowNameEdition?: boolean
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onChange,
  allowNameEdition
}) => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)

  const dispatch = useDispatch()

  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const deviceName = _.get(defaultDevice, 'deviceName')

  const [deviceNameEdition, setDeviceNameEdition] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editedDeviceName, setEditedDeviceName] = useState(deviceName)

  const deviceSelectOptions = getDeviceOptionsToSelect(userDevices)
  const indexOfDefaultDeviceInOptions =
    _.findIndex(deviceSelectOptions, (device) => device.value === defaultDevice._id)

  useEffect(() => {
    const updateUserDevices = async () => {
      const userDevices = await fetchUserDevices({
        token,
        loadingCallback: setLoading 
      })
  
      dispatch(setUserDevices(userDevices))
    }
    updateUserDevices()
  }, [token])

  const handleSaveNewDeviceName = async () => {
    setDeviceNameEdition(false)
    await editDeviceName({
      token,
      deviceId: defaultDevice._id,
      deviceName: editedDeviceName,
      loadingCallback: setLoading
    })

    const userDevices = await fetchUserDevices({
      token,
      loadingCallback: setLoading 
    })

    dispatch(setUserDevices(userDevices))
  }

  const handleChangeDeviceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDeviceName(e.target.value)
  }

  return (
    <div className='device-selector'>
      <h2>Dispositivo</h2>
      <div className='device-selector__container'>
        {deviceNameEdition
          ? <Input
            onChange={handleChangeDeviceName}
            value={editedDeviceName} />
          : <CustomSelect
            defaultValue={deviceSelectOptions[indexOfDefaultDeviceInOptions]}
            options={deviceSelectOptions} />}
        {allowNameEdition ?
          <EditIconWithTooltip
            uniqueId='device-selector'
            onToggle={() => setDeviceNameEdition(!deviceNameEdition)}
            onSave={handleSaveNewDeviceName}/> : null}
      </div>
    </div>
  )
}