import _ from 'lodash'
import { 
  HiCog as Cog
} from 'react-icons/hi'

import { LoadingIcon } from '../loading-icon'

import {
  BiStation as StationIcon
} from 'react-icons/bi'

import './styles.scss'
import { Sensors } from '../sensors'
import { Loading } from 'components'

interface DeviceCardProps {
  device: any
  realTimeData: any
  loading: Boolean
}

export const DeviceCard = ({ device, realTimeData, loading }: DeviceCardProps) => {
  const isDeviceConnected = !_.isEmpty(realTimeData)
  const deviceSensors = _.get(device, 'sensors')
  const measures = _.get(realTimeData, 'measures')
  const {
    deviceName
  } = device

  const StatusLabel = () => {
    if (loading) return <Loading />

    return (
      <div className={`card-infos__status card-infos__status--${isDeviceConnected ? 'online' : 'offline'}`}>
        {isDeviceConnected ? 'Online' : 'Offline'}
      </div>
    )
  }

  return (
    <div className='device-card'>
      <div className='card-infos'>
        <div className='card-infos__name'>
          <StationIcon size={22} />
          <span>{deviceName}</span>
        </div>
        <StatusLabel />
      </div>
      {loading ? null : <div className='device-components'>
        <Sensors
          deviceStatus={isDeviceConnected}
          measures={measures}
          sensors={deviceSensors} />
      </div>}
    </div>
  )
}

{/* <div className={`generic-card generic-card--${type} ${className ? className : ''}`}>
      {type === 'default' && renderDeviceSignalIcon()}
      <div className='card-infos'>
        <CardLabel Icon={icon} label={label} />
      </div>
      <div className={`card-data card-data--${type}`}>
        {CustomData && <CustomData />}
        {children}
      </div>
    </div> */}