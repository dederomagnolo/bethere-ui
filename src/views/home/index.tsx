import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import { useNavigate } from 'react-router'
import _ from 'lodash'

import { getToken } from 'redux/user/selectors'
import { getUserDevices } from 'redux/device/selectors'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import { WsReadyState } from 'global/consts'

import { LoadingIcon } from './blocks/loading-icon'
import { DeviceCard } from './blocks/device-card'

import { getStatusFromLocalStation } from 'services/local-station'
import { useFetch } from 'hooks/useFetch'

import '../styles.scss'
import './styles.scss'

type SensorBroadcastedMeasure = {
  [key: string]: {
    temperature?: string,
    moisture?: string,
    humidity?: string
  }
}

type DeviceRealTimeData = { 
  wateringStatus: { nextTimeSlot: string }, 
  measures: SensorBroadcastedMeasure[] 
}

export const Home = () => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ type: '' })

  const [devicesRealTimeData, setDevicesRealTimeData] = useState<DeviceRealTimeData[]>([])
  const [devicesWaitingForUpdate, setDevicesWaitingForUpdate] = useState<string[]>([])

  const {
    data,
    loading: loadingOnGetStatus
  } = useFetch(async () => {
    setLoading(true)
    await getStatusFromLocalStation({ token })
  }, [])

  const {
    lastMessage,
    readyState
  } = useWebSocket(process.env.REACT_APP_WS_HOST || '', {
    onMessage: (event) => {},
    onOpen: (event) => {
      console.log(`Connection opened`)
      setLoading(true)
    },
    onError: async (err: any) => {
      setError({ type: 'websocket'})
    },
    onReconnectStop: () => setError({ type: 'websocket'}),
    shouldReconnect: (closeEvent) => {
      return true
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    queryParams: {
      uiClient: token
    }
  })

  useEffect(() => {
    setDevicesRealTimeData(data)
  }, [data])


  useEffect(() => {
    if (!loadingOnGetStatus) {
      const receivedData = lastMessage && lastMessage.data
      const parsedData = JSON.parse(receivedData)
  
      console.log({ parsedData })
  
      if (parsedData as DeviceRealTimeData[]) {
        setLoading(false)
        setDevicesRealTimeData(parsedData)
      }
    }
  }, [loadingOnGetStatus, lastMessage])

  const renderWebsocketConnectionStatus = () => {
    const containerClass = 'server-connection-status'
    const StatusLabelWithIcon = () => {
      switch (readyState) {
        case WsReadyState.OPEN:
          return (
            <div className='server-connection-status__icon-container'>
              <div className='server-connection-status__animated-icon__bg-pulse' />
              <OnlineIcon className={`${containerClass}--online`}/>
              <p>Disponível</p>
            </div>
          )
        case WsReadyState.CONNECTING:
          return <LoadingIcon />
        default:
          return (
          <div className='server-connection-status__icon-container'>
            <OfflineIcon className={`${containerClass}--offline`}/>
            <p>Sem conexão</p>
          </div>
        )
      }
    }

    return (
      <div className='server-connection-status'>
        <h3>Status do servidor:</h3>
        <div className='server-connection-status__container'>
          <StatusLabelWithIcon />
        </div>
      </div>
    )
  }

  const mappedDeviceCards =
    _.map(userDevices, (device) => {
      const deviceId = device._id
      const realTimeData = devicesRealTimeData[deviceId] || {}
      const isDeviceWaitingUpdate = devicesWaitingForUpdate.includes(deviceId)
      return (
        <DeviceCard
          // isDeviceWaitingUpdate={isDeviceWaitingUpdate}
          key={device._id}
          loading={loading}
          device={device}
          realTimeData={realTimeData} />
      )
    })
  
  return(
    <div className='page-content home-view'>
      {renderWebsocketConnectionStatus()}
      <h2>Dispositivos</h2>
      <div className='device-cards'>
        {mappedDeviceCards}
      </div>
      <div className='dashboard'>
      </div>
    </div>
  )
}