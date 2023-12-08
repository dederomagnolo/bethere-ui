import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

import { getUserDevices } from 'redux/device/selectors'

import { CustomSelect } from '../ui-atoms/select'

import { EditIconWithTooltip, Input, Toggle } from 'components'
import { getDeviceOptionsToSelect } from 'global/functions'
import { editDeviceName, fetchUserDevices, setDefaultDevice, editSensorName } from 'services/fetch'
import { getToken } from 'redux/user/selectors'
import { setUserDevices } from 'redux/device/actions'

import { useFetch } from 'hooks/useFetch'

import './styles.scss'

interface DeviceSelectorProps {
  allowNameEdition?: boolean
  showDeviceInfo?: boolean
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  allowNameEdition,
  showDeviceInfo
}) => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const dispatch = useDispatch()

  const {
    data,
    error
  } = useFetch(async () => {
    const res = await fetchUserDevices({
      token
    })
    if (res) {
      dispatch(setUserDevices(userDevices))
    }
  }, [token])

  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const defaultDeviceName = _.get(defaultDevice, 'deviceName')

  const [selectedDevice, setSelectedDevice] = useState(defaultDevice || { _id: '' } )
  const [selectedSensor, setSelectedSensor] = useState({ name:'', model: '', _id: '' })
  const [deviceNameEdition, setDeviceNameEdition] = useState(false)

  const [loading, setLoading] = useState(false)

  const [editedDeviceName, setEditedDeviceName] = useState(defaultDeviceName)
  const [editedSensorName, setEditedSensorName] = useState('')
  const deviceSerialKey = _.get(selectedDevice, 'deviceSerialKey')
  
  // to get from most updated devices collection
  const sensors = _.find(userDevices, (device) => {
    return selectedDevice._id === device._id
  }).sensors

  const deviceSelectOptions = getDeviceOptionsToSelect(userDevices)
  const indexOfDefaultDeviceInOptions =
    _.findIndex(deviceSelectOptions, (device) => device.value === selectedDevice._id)

  const handleSaveNewDeviceName = async () => {
    setDeviceNameEdition(false)
    await editDeviceName({
      token,
      deviceId: selectedDevice._id,
      deviceName: editedDeviceName
    })

    const userDevices = await fetchUserDevices({
      token
    })

    dispatch(setUserDevices(userDevices))
  }

  const handleChangeDeviceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDeviceName(e.target.value)
  }

  const handleChangeSelectedSensorName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSensorName(e.target.value)
  }

  const handleDeviceChange = ({ value }: { value: string, label: string }) => {
    const deviceFromOption = _.find(userDevices, (device) => device._id === value)
    setSelectedDevice(deviceFromOption)
  }
  

  const mappedSensors = _.map(sensors, (sensor: any) => {
  const name = sensor.name || sensor.model
    return (
      <div
        onClick={() => {
          setSelectedSensor(sensor)
          setEditedSensorName(name)
        }}
        key={sensor._id}
        className={`sensors-list__card ${selectedSensor._id === sensor._id ? 'selected' : ''}`}>
        {name}
      </div>
    )
  })

  const handleToggleDefaultDevice = async (value: any) => {
    const res = await setDefaultDevice({ token, deviceId: selectedDevice._id })
    const userDevices = await fetchUserDevices({
      token
    })

    dispatch(setUserDevices(userDevices))
    const deviceFromOption = _.find(userDevices, (device) => device._id === selectedDevice._id)
    setSelectedDevice(deviceFromOption)
  }

  const handleSaveSensorName = async () => {
    setSelectedSensor({ name: '', model: '', _id: ''})

    if(editedSensorName === selectedSensor.name) return null

    await editSensorName({
      token,
      sensorId: selectedSensor._id,
      sensorName: editedSensorName
    })

    const userDevices = await fetchUserDevices({
      token
    })

    dispatch(setUserDevices(userDevices))
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
            onChange={handleDeviceChange}
            defaultValue={deviceSelectOptions[indexOfDefaultDeviceInOptions]}
            options={deviceSelectOptions} />}
        {allowNameEdition ?
          <EditIconWithTooltip
            uniqueId='device-selector'
            onToggle={() => setDeviceNameEdition(!deviceNameEdition)}
            onSave={handleSaveNewDeviceName}/> : null}
      </div>
      {showDeviceInfo && (
        <div className='device-selector__info'>
          <div className='device-selector__info__container'>
            <p className='title'>Código Serial:</p>
            <p>{deviceSerialKey}</p>
          </div>
          <div className='device-selector__info__container'>
            <p className='title'>Dispositivo padrão</p>
            <Toggle
              disabled={selectedDevice.defaultDevice}
              checked={selectedDevice.defaultDevice}
              onChange={handleToggleDefaultDevice}
            />
          </div>
          {sensors && sensors.length ? <div className='device-selector__info__container'>
            <p className='title'>{sensors.length > 1 ? 'Sensores' : 'Sensor'}:</p>
            <div className='sensors-list'>
              {mappedSensors}
            </div>
          </div> : null}
          {_.isEmpty(selectedSensor.model) ? null : (
              <div className='device-selector__info__container'>
                <p className='title'>Nome:</p>
                <Input
                  onChange={handleChangeSelectedSensorName}
                  value={editedSensorName} />
                <EditIconWithTooltip
                  saveMode
                  uniqueId='device-selector'
                  onSave={handleSaveSensorName}/>
              </div>
          )}
        </div>
      )}
    </div>
  )
}