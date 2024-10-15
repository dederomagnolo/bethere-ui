import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import _ from 'lodash'

import { getUSerInfo } from 'redux/user/selectors'
import { getUserDevices } from 'redux/device/selectors'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import {
  RxUpdate as UpdateIcon
} from 'react-icons/rx'

import { WsReadyState } from 'global/consts'

import { LoadingIcon } from './blocks/loading-icon'
import { DeviceCard } from './blocks/device-card'

import { getStatusFromLocalStation } from 'services/local-station'
import { useFetch } from 'hooks/useFetch'

import '../styles.scss'
import './styles.scss'
import { DeviceRealTimeData } from 'types/interfaces'
import { View } from 'components/app-view'
import { fetchUserDevices } from 'services/devices'
import { setUserDevices } from 'redux/device/actions'

export const Home = () => {
  const userInfo = useSelector(getUSerInfo)
  const userDevices = useSelector(getUserDevices)
  const { token, firstName } = userInfo

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ type: '' })

  const [connectionTimedOut, setConnectionTimedOut] = useState(false)
  const [devicesRealTimeData, setDevicesRealTimeData] = useState<DeviceRealTimeData[]>([])
  const [devicesWaitingForUpdate, setDevicesWaitingForUpdate] = useState<string[]>([])

  const {
    data,
    loading: loadingOnGetStatus
  } = useFetch(async () => {

    if (!connectionTimedOut) {
      setLoading(true)
      await getStatusFromLocalStation({ token })
      const res = await fetchUserDevices({ token })

      if (res) {
        dispatch(setUserDevices(res))
      }
    }
  }, [connectionTimedOut])

  const {
    lastMessage,
    readyState,
    getWebSocket
  } = useWebSocket(
    process.env.REACT_APP_WS_HOST || '', 
    {
      onMessage: (event) => {
      },
      onOpen: (event) => {
        console.log(`Connection opened`)
        setLoading(true)

        // setTimeout(() => setConnectionTimedOut(true), 60000)
      },
      onError: async (err: any) => {
        setError({ type: 'websocket'})
      },
      onReconnectStop: () => setError({ type: 'websocket'}),
      shouldReconnect: (closeEvent) => {
        return !connectionTimedOut
      },
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      queryParams: {
        uiClient: token
      }
    },
    !connectionTimedOut // shouldConnect
  )

  useEffect(() => {
    setDevicesRealTimeData(data)
  }, [data])

  useEffect(() => {
    if (!loadingOnGetStatus) {
      const receivedData = lastMessage && lastMessage.data
      const parsedData = JSON.parse(receivedData)
  
      _.forEach(parsedData, (deviceRealTimeData, deviceId) => {
        const hasMeasuresData = deviceRealTimeData.measures
        const isDeviceWaiting = devicesWaitingForUpdate.includes(deviceId)

        if (!hasMeasuresData && !isDeviceWaiting) {
          setDevicesWaitingForUpdate([...devicesWaitingForUpdate, deviceId])
        } else { // device has measures object but it is on waiting collection, should remove
          const updatedDevicesWaiting = _.filter(devicesWaitingForUpdate, (deviceWaiting) => deviceWaiting !== deviceId)
          setDevicesWaitingForUpdate(updatedDevicesWaiting)
        }
      })
  
      if (parsedData as DeviceRealTimeData[]) {
        setLoading(false)
        setDevicesRealTimeData(parsedData)
      }
    }
  }, [loadingOnGetStatus, lastMessage])

  const renderWebsocketConnectionStatus = () => {
    const containerClass = 'server-connection-status'

    const StatusLabelWithIcon = () => {
      if (connectionTimedOut) {
        return (
          <div className='server-connection-status__icon-container' onClick={() => {
            setConnectionTimedOut(false)
            }}>
            <UpdateIcon className={`${containerClass}`}/>
            <p>Conexão expirada. Clique para renovar.</p>
          </div>
        )
      }

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
        <h3>Conexão com o servidor:</h3>
        <div className='server-connection-status__container'>
          <StatusLabelWithIcon />
        </div>
      </div>
    )
  }

  const mappedDeviceCards =
    _.map(userDevices, (device) => {
      const deviceId = device._id
      const realTimeData = devicesRealTimeData[deviceId] || {} as DeviceRealTimeData
      const isDeviceWaitingUpdate = devicesWaitingForUpdate.includes(deviceId)
      return (
        <DeviceCard
          userConnectionTimedOut={connectionTimedOut}
          isDeviceWaitingUpdate={isDeviceWaitingUpdate}
          key={device._id}
          loading={loading}
          device={device}
          realTimeData={realTimeData} />
      )
    })
  
  return(
    <View className='page-content home-view' title={firstName ? `Olá, ${firstName}` : 'Olá!'}>
      {renderWebsocketConnectionStatus()}
      <h2>Dispositivos</h2>
      <div className='device-cards'>
        {mappedDeviceCards}
      </div>
      <div className='dashboard'>
      </div>
    </View>
  )
}