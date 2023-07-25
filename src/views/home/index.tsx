import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import _ from 'lodash'

import { GenericCard } from 'components'
import { WateringCardData } from './blocks/watering-card-data'

import { getToken } from '../../redux/user/selectors'
import { getUserDevices } from '../../redux/device/selectors'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import '../styles.scss'
import './styles.scss'
import { WsReadyState } from 'global/consts';
import { LoadingIcon } from './blocks/loading-icon';
import { Sensors } from './blocks/sensors';
import { CARDS } from './utils/constants';

export const Home = () => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ type: '' })
  const [deviceRealTimeData, setDeviceRealTimeData] = useState({
    defaultDeviceStatus: false,
    measures: [],
    lastCommandReceived: ''
  })

  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const deviceName = _.get(defaultDevice, 'deviceName')
  const deviceSensors = _.get(defaultDevice, 'sensors')
  const isDeviceOffline = error.type !== ''

  const {
    defaultDeviceStatus,
    measures,
  } = deviceRealTimeData

  useEffect(() => {
    console.log('oi')
  }, [defaultDevice])

  const handleDeviceNonResponding = () => {
    setLoading(false)
    setError({ type: 'device'})
  }

  const onMessage = (event: any) => {
    const receivedData = event && event.data
    const parsedData = JSON.parse(receivedData)

    setTimeout(() => {
      handleDeviceNonResponding()
    }, 18000)

    if(parsedData) {
      const {
        connectedDevices,
        measures,
        lastCommandReceived
      } = parsedData

      // need to get last command received from DB while this is loading

      let connectedDeviceData // lets type devices!

      // check user devices connected if it exists in the collection
      _.every(connectedDevices, (connectedDevice) => {
        const existsInUserCollection =
          _.find(userDevices, (userDevice) => connectedDevice === userDevice.deviceSerialKey)
        connectedDeviceData = existsInUserCollection
        return existsInUserCollection
      })

      const isConnectedDeviceDefault = _.get(connectedDeviceData, 'defaultDevice', false)
      
      setDeviceRealTimeData({
        measures,
        lastCommandReceived,
        defaultDeviceStatus: isConnectedDeviceDefault
      })

      setLoading(false)

      if (!isConnectedDeviceDefault) {
        setError({ type: 'device'})
      }
    }
  }

  const {
    readyState,
    } = useWebSocket(process.env.REACT_APP_WS_HOST || '', {
    onMessage: (event) => {onMessage(event)},
    onOpen: (event) => {
      console.log(`Connecting to WebSocket Server...`)
      setLoading(true)
    },
    onError: (err) => {
      console.log(err)
      setError({ type: 'websocket'})
    },
    onReconnectStop: () => setError({ type: 'websocket'}),
    shouldReconnect: (closeEvent) => {
      return true
    },
    filter: (message) => {
      console.log(message.data)
      return true      
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    queryParams: {
      uiClient: token
    }},
  );

  const StatusLabel = () => {
    if (loading) {
      return <LoadingIcon />
    }

    const offlineLabel = (
      isDeviceOffline && (
        <div className='device-status__offline-label'>
          <OfflineIcon   className='wifi-error-icon'/>
          <p>Offline</p>
        </div>
      )
    )

    return (
      <div
        className={`device-status device-status--${defaultDeviceStatus ? 'online' : 'offline'}`}>
        {defaultDeviceStatus ? <p>Online</p> : offlineLabel}
      </div>
    )
  }

  const renderWebsocketConnectionStatus = () => {
    const containerClass = 'server-connection-status'
    const StatusLabelWithIcon = () => {
      if (loading) {
        return <LoadingIcon />
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
        <h3>Status do servidor:</h3>
        <div className='server-connection-status__container'>
          <StatusLabelWithIcon />
        </div>
      </div>
    )
  }
  
  return(
    <div className='page-content home-view'>
      {renderWebsocketConnectionStatus()}
      <h2>Estação local</h2>
      <GenericCard
        CustomData={StatusLabel}
        settingsButtonRoute='/configuracoes'
        label={deviceName} />
      <div className='dashboard'>
        <Sensors
          isDeviceOffline={!defaultDeviceStatus}
          measures={measures}
          loading={loading}
          sensors={deviceSensors} />
        <GenericCard
          settingsButtonRoute='configuracoes'
          type='watering'
          icon={CARDS['watering'].icon}
          label={CARDS['watering'].label}
        >
          <WateringCardData
            deviceRealTimeData={{defaultDeviceStatus: true, measures: [], lastCommandReceived: '' }}
            device={defaultDevice}
            wsStatus={1} />
        </GenericCard>
      </div>
    </div>
  )
}