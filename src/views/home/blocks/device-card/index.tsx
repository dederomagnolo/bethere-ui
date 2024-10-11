import _ from 'lodash'
import moment from 'moment'

import {
  BiStation as StationIcon
} from 'react-icons/bi'

import './styles.scss'
import { Sensors } from '../sensors'
import { AppCard, Loading } from 'components'
import { Actuator, ActuatorRealTimeData, Device, DeviceRealTimeData } from 'types/interfaces'
import { WateringCardData } from '../watering-card-data'
import { ActuatorCard } from '../actuator-card'

interface DeviceCardProps {
  device: Device
  realTimeData: DeviceRealTimeData
  loading: boolean
  isDeviceWaitingUpdate: boolean
  userConnectionTimedOut: boolean
}

export const DeviceCard = ({
  device,
  realTimeData,
  loading,
  isDeviceWaitingUpdate,
  userConnectionTimedOut
}: DeviceCardProps) => {
  const isDeviceConnected = !_.isEmpty(realTimeData) && !userConnectionTimedOut

  const deviceSensors = device.sensors
  const measures = _.get(realTimeData, 'measures')
  const lastSeen = device.lastSeen || ''
  const lastSeenFormated = moment(lastSeen).isValid() ? moment(lastSeen).format("DD/MM/YY, HH:mm"): 'Sem registro'
  const deviceActuators = device.actuators

  const {
    deviceName
  } = device

  const StatusLabel = () => {
    if (loading) return <Loading />

    return (
      <div className={`card-infos__status card-infos__status--${isDeviceConnected ? 'online' : 'offline'}`}>
        <div>{isDeviceConnected ? 'Online' : 'Offline'}</div>
        {!isDeviceConnected 
          ? userConnectionTimedOut ? null : <div className='card-infos__last-seen'>Última conexão: {lastSeenFormated}</div>
          : null}
      </div>
    )
  }

  const mappedDeviceActuators = _.map(deviceActuators, (actuator: Actuator) => {
    const isEnabled = actuator.enabled // TODO: change to enabled
    const boardNumber = actuator.boardNumber
    const actuatorRealTimeData = realTimeData.actuators?.find((data: any) => boardNumber === data.boardNumber)

    return (
      (isEnabled
        ? (
          <ActuatorCard
            key={actuator.name || actuator.boardNumber}
            userId={device.userId}
            isDeviceConnected={isDeviceConnected}
            connectionLoading={loading}
            actuatorRealTimeData={actuatorRealTimeData || {} as ActuatorRealTimeData}
            deviceSettings={device.settings?.[0]} // will be changed to automation linked with actuator
            actuator={actuator} />
          ) : null)
    )
  })

  return (
    <div className='device-card'>
      <div className='card-infos'>
        <div className='card-infos__name'>
          <StationIcon size={22} />
          <span>{deviceName}</span>
        </div>
        <StatusLabel />
      </div>
      {loading ? null : (<div className='device-components'>
        <Sensors
          isDeviceWaitingUpdate={isDeviceWaitingUpdate}
          isDeviceConnected={isDeviceConnected}
          measures={measures}
          sensors={deviceSensors} />
        <div className='actuators'>
          {mappedDeviceActuators}
        </div>
      </div>)}
    </div>
  )
}