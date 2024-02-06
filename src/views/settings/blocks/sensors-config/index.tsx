import { useState } from 'react'
import _ from 'lodash'

import { EditIconWithTooltip, Input, Toggle } from 'components'
import { editSensorName, fetchUserDevices } from 'services/fetch'

import { getToken } from 'redux/user/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDevices } from 'redux/device/actions'

import './styles.scss'

export const SensorsConfig = ({
  sensors = [],
  deviceId
}: any) => {
  const [sensorsToRender, setSensorsToRender] = useState(sensors)
  const [sensorToEdit, setSensorToEdit] = useState({ _id: '' })
  const [editedSensorName, setEditedSensorName] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(getToken)

  const handleEditSensorInfo = async () => {
    await editSensorName({
      token,
      sensorId: sensorToEdit._id,
      sensorName: editedSensorName
    })

    const userDevices = await fetchUserDevices({
      token
    })

    // need to add loadings

    dispatch(setUserDevices(userDevices))

    const sensors = _.find(userDevices, (device) => {
      return deviceId === device._id
    }).sensors

    setSensorsToRender(sensors)
  }

  const handleEditSensorName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSensorName(e.target.value)
  }

  const mappedSensors = _.map(sensorsToRender, (sensor: any) => {
    const name = sensor.name || sensor.model
    const isSensorEnabled = _.get(sensor, 'enabled')
    const id = _.get(sensor, '_id')

    return (
      <div key={id} className='sensor-settings'>
        <div className='sensor-info'>
            <div className='sensor-info__name-container'>
              {sensorToEdit._id === id
                ? <Input value={editedSensorName} onChange={handleEditSensorName} />
                : <span>{name}</span>}
              <EditIconWithTooltip
                uniqueId={id}
                onCancel={() => {
                  setEditedSensorName('')
                  setSensorToEdit({ _id: '' })
                }}
                onSave={handleEditSensorInfo}
                onEdit={() => {
                  setEditedSensorName(name)
                  setSensorToEdit(sensor)
              }} />
            </div>
            <span className='sensor-info__model'>Modelo: {sensor.model}</span>
        </div>
        <Toggle checked={isSensorEnabled} onChange={handleEditSensorInfo} />
      </div>
    )
  })

  const renderDescriptionLabel = () => {
    const sensorsQuantity = sensors.length
    if(!sensorsQuantity) return 'Esta estação local não possui sensores cadastrados.'

    const adjustedLabel =
      sensorsQuantity > 1
        ? `${sensorsQuantity} sensores cadastrados`
        : `${sensorsQuantity} sensor cadastrado`
    
    return `Esta estação local possui ${adjustedLabel}. Configure abaixo o nome e a exibição da medição na tela de dashboard.`
  }

  return (
    <div className='options options--single'>
      <span className='description'>{renderDescriptionLabel()}</span>
      <div className='sensors-list'>
        {sensorsToRender && sensorsToRender.length ? (
          <div className='device-selector__info__container'>
            <div className='sensors-list'>
              {mappedSensors}
            </div>
          </div>) : null}
      </div>
    </div>
  )
}