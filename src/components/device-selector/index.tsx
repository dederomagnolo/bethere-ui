import { useState, useEffect } from 'react'
import { getDeviceOptionsToSelect } from 'global/functions'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

import {
  BiSave as SaveIcon,
  BiEdit as EditIcon
} from 'react-icons/bi'

import { getUserDevices } from 'redux/device/selectors'

import { CustomSelect } from '../select'

import './styles.scss'
import { Input } from 'components'
import { editDeviceName, fetchUserDevices } from 'services/fetch'
import { getToken } from 'redux/user/selectors'
import { setUserDevices } from 'redux/device/actions'

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

  const [deviceNameEdition, setDeviceNameEdition] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editedDeviceName, setEditedDeviceName] = useState(defaultDevice.deviceName)

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

  const Icon = () => deviceNameEdition
    ? <SaveIcon onClick={handleSaveNewDeviceName} />
    : <EditIcon onClick={() => setDeviceNameEdition(true)} />

  const handleChangeDeviceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDeviceName(e.target.value)
  }

  return (
    <div className='device-selector'>
      <h1>Dispositivo</h1>
      <div className='device-selector__container'>
        {deviceNameEdition
          ? <Input
            onChange={handleChangeDeviceName}
            value={editedDeviceName} />
          : <CustomSelect
            defaultValue={deviceSelectOptions[indexOfDefaultDeviceInOptions]}
            options={deviceSelectOptions} />}
        {allowNameEdition ? <Icon /> : null}
      </div>
    </div>
  )
}