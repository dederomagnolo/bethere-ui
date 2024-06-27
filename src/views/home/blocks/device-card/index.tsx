import _ from 'lodash'
import moment from 'moment'

import {
  BiStation as StationIcon
} from 'react-icons/bi'

import './styles.scss'
import { Sensors } from '../sensors'
import { AppCard, Loading } from 'components'
import { Actuator, Device } from 'types/interfaces'
import { WateringCardData } from '../watering-card-data'

interface DeviceCardProps {
  device: Device
  realTimeData: any
  loading: boolean
}

export const DeviceCard = ({ device, realTimeData, loading }: DeviceCardProps) => {
  const isDeviceConnected = !_.isEmpty(realTimeData)
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
          ? <div className='card-infos__last-seen'>Última conexão: {lastSeenFormated}</div> 
          : null}
      </div>
    )
  }

  const mappedDeviceActuators = _.map(deviceActuators, (actuator: Actuator) => {
    const isEnabled = actuator.status // TODO: change to enabled
    return (
      (isEnabled
        ? <AppCard key={actuator._id}>
            <WateringCardData
              connectionLoading={loading}
              deviceRealTimeData={realTimeData || {}}
              device={device}
              wsStatus={1} />
          </AppCard> 
        : null)
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
          deviceStatus={isDeviceConnected}
          measures={measures}
          sensors={deviceSensors} />
        <div className='actuators'>
          {mappedDeviceActuators}
        </div>
      </div>)}
    </div>
  )
}