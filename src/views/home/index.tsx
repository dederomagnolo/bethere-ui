import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import { useNavigate } from 'react-router'
import _ from 'lodash'

import { GenericCard } from 'components'
import { WateringCardData } from './blocks/watering-card-data'

import { getToken } from 'redux/user/selectors'
import { getUserDevices } from 'redux/device/selectors'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import '../styles.scss'
import './styles.scss'
import { WsReadyState } from 'global/consts';
import { Sensors } from './blocks/sensors';
import { CARDS } from './utils/constants';
import { checkToken } from 'services/fetch';
import { clearUserState } from 'redux/user/actions';

import { LoadingIcon } from './blocks/loading-icon';
import { Devices } from './blocks/devices'

export const Home = () => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ type: '' })
  const [deviceRealTimeData, setDeviceRealTimeData] = useState({
    defaultDeviceStatus: false,
    measures: [],
    lastCommandReceived: '',
    wateringStatus: {}
  })

  const [devicesRealTimeData, setDevicesRealTimeData] = useState({} as any)
  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)

  const deviceName = _.get(defaultDevice, 'deviceName')
  const deviceSensors = _.get(defaultDevice, 'sensors')

  const {
    defaultDeviceStatus,
    measures,
    wateringStatus
  } = deviceRealTimeData

  const handleDeviceNonResponding = () => {
    setLoading(false)
    setError({ type: 'device'})
  }

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
      const res = await checkToken(token)
      console.log({res})

      if (res && res instanceof Error) {
        navigate('/login')
        dispatch(clearUserState())
      }
    },
    onReconnectStop: () => setError({ type: 'websocket'}),
    shouldReconnect: (closeEvent) => {
      return true
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    queryParams: {
      uiClient: token
    }},
  )

  useEffect(() => {
    const receivedData = lastMessage && lastMessage.data
    const parsedData = JSON.parse(receivedData)

    console.log({ parsedData })
  
    setTimeout(() => {
      handleDeviceNonResponding()
    }, 18000)

    if (parsedData) {
      const {
        connectedDevices,
        measures,
        lastCommandReceived,
        wateringStatus
      } = parsedData


      // this approach should be the final, should remove all of default device logics after migration
      const devicesRealTimeDataCollection = _.omit(
        parsedData, 'connectedDevices', 'measures', 'lastCommandReceived', 'wateringStatus')

      setDevicesRealTimeData(devicesRealTimeDataCollection)
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
        defaultDeviceStatus: isConnectedDeviceDefault,
        wateringStatus
      })

      setLoading(false)

      if (!isConnectedDeviceDefault) {
        setError({ type: 'device'})
      }
    }
  }, [lastMessage])

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
  
  return(
    <div className='page-content home-view'>
      {renderWebsocketConnectionStatus()}
      <h2>Dispositivos</h2>
      <Devices
        devicesRealTimeData={devicesRealTimeData}
        userDevices={userDevices}
        defaultDeviceStatus={defaultDeviceStatus}
        loading={loading}
      />
      <div className='dashboard'>
        <Sensors
          isDeviceOffline={!defaultDeviceStatus}
          measures={measures}
          loading={loading}
          sensors={deviceSensors} />
        <GenericCard
          type='watering'
          icon={CARDS['watering'].icon}
          label={CARDS['watering'].label}
        >
          <WateringCardData
            connectionLoading={loading}
            deviceRealTimeData={deviceRealTimeData}
            device={defaultDevice}
            wsStatus={1} />
        </GenericCard>
      </div>
    </div>
  )
}