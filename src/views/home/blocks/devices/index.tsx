import _ from 'lodash'
import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import { GenericCard } from 'components'
import { LoadingIcon } from '../loading-icon'

import './styles.scss'

interface DevicesProps {
  userDevices: any
  loading: boolean
  defaultDeviceStatus: boolean
  devicesRealTimeData: any
}

export const Devices = ({
  userDevices,
  loading,
  defaultDeviceStatus,
  devicesRealTimeData = {}
}: DevicesProps) => {

  const StatusLabel = ({ isDeviceConnected } : {isDeviceConnected: boolean }) => {
    if (loading) {
      return <LoadingIcon />
    }

    const offlineLabel = (
      !isDeviceConnected && (
        <div className='device-status__offline-label'>
          {/* <OfflineIcon   className='wifi-error-icon'/> */}
          <p>Offline</p>
        </div>
      )
    )

    return (
      <div
        className={`device-status device-status--${isDeviceConnected ? 'online' : 'offline'}`}>
        {isDeviceConnected ? <p>Online</p> : offlineLabel}
      </div>
    )
  }

  const cards = _.map(userDevices, (device) => {
    const connectedIds = _.keys(devicesRealTimeData)
    const isDeviceConnected = connectedIds.includes(device._id)
    return (
      <GenericCard
        key={device._id}
        CustomData={() => <StatusLabel isDeviceConnected={isDeviceConnected} />}
        label={device.deviceName}
      />
    )
  })

  return (
    <div className='device-cards'>
      {cards}
    </div>
  )
}