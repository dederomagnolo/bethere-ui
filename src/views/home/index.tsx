import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import { useNavigate } from 'react-router'
import _ from 'lodash'

import { WateringCardData } from './blocks/watering-card-data'

import { getToken } from 'redux/user/selectors'
import { getUserDevices } from 'redux/device/selectors'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import { WsReadyState } from 'global/consts'

import { checkToken } from 'services/fetch'

import { AppCard } from 'components/app-card'

import { clearUserState } from 'redux/user/actions'

import { LoadingIcon } from './blocks/loading-icon'
import { Devices } from './blocks/devices'
import { DeviceCard } from './blocks/device-card'

import '../styles.scss'
import './styles.scss'

export const Home = () => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ type: '' })

  const [devicesRealTimeData, setDevicesRealTimeData] = useState({} as any)

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
    }, 10000)

    if (parsedData) {
      setDevicesRealTimeData(parsedData)
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

  const mappedDeviceCards =
    _.map(userDevices, (device) => {
      const realTimeData = devicesRealTimeData[device._id] || {}
      return <DeviceCard loading={loading} device={device} realTimeData={realTimeData} />
    })
  
  const devicesWithActuators = _.map(devicesRealTimeData, (realTimeData, id) => { 
    // need to think about this structure to avoid something different than string
    if (typeof realTimeData === 'string') return null
    
    const device =
      _.find(userDevices, (deviceFromCollection) => deviceFromCollection._id === id)
    
    const actuators = _.get(device, 'actuators', [])

    return {
      actuators,
      realTimeData,
      device
    }
  })

  let mappedAutomationCards = [] as any
  _.forEach(_.compact(devicesWithActuators), (item) => {
    const actuators = item?.actuators ?? []

    mappedAutomationCards = _.map(actuators, (data) => (
      <AppCard key={data._id}>
        <WateringCardData
          connectionLoading={loading}
          deviceRealTimeData={item?.realTimeData || {}}
          device={item?.device}
          wsStatus={1} />
      </AppCard>
    ))
  })
  
  return(
    <div className='page-content home-view'>
      {renderWebsocketConnectionStatus()}
      <h2>Dispositivos</h2>
      <div className='device-cards'>
        {mappedDeviceCards}
      </div>
      <div className='dashboard'>
        {mappedAutomationCards}
      </div>
    </div>
  )
}