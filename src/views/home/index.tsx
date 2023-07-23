import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import _ from 'lodash'

import { GenericCard } from 'components'
import { WateringCardData } from './blocks/watering-card-data'

import BeatLoader from 'react-spinners/BeatLoader'

import { getToken } from '../../redux/user/selectors'
import { getUserDevices } from '../../redux/device/selectors'

import {
  RiSignalWifiErrorFill as WiFiErrorIcon
} from 'react-icons/ri'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
  TbCircleDotted as ConnectingIcon
} from  'react-icons/tb'

import {
  FaTint as TintIcon,
  FaThermometerHalf as ThermometerIcon,
} from 'react-icons/fa'

import { cards } from './utils/constants'

import '../styles.scss'
import './styles.scss'
import { WsReadyState } from 'global/consts';

const websocketUrl = 'ws://localhost:8080';

const renderGenericCard = (type: string, CustomData?: any) => {
  const { label, icon } = cards[type]
  return (
    <GenericCard
      settingsButtonRoute='configuracoes'
      type={type}
      icon={icon}
      label={label}
      CustomData={CustomData} />
  )
}

const LoadingIcon = () => <ConnectingIcon className='animated-dashed-loading' />

const renderMeasures = (measures: any, loading: boolean) => { // type here
  const MeasureLabel = ({ type }: { type: any } ) => {
    let humidity = _.get(measures, 'internalHumidity') 
    let temperature = _.get(measures, 'internalTemperature')

    if (type === 'external') {
      humidity = _.get(measures, 'externalHumidity')
      temperature = _.get(measures, 'externalTemperature')
    }

    const renderMeasure = (data: number) => {
      return loading ? <LoadingIcon /> : <span>{data}</span>
    }
    
    return (
      <div className='measures' key={type}>
        <div className='measure'>
          <div className='measure-label'>
            <TintIcon className='measure-icon--humidity' />
            <span className='measure-category'>Umidade</span>
          </div>
          <span className='measure-data'>{renderMeasure(humidity)}</span>
        </div>
        <div className='measure'>
          <div className='measure-label'>
            <ThermometerIcon className='measure-icon--temperature' />
            <span className='measure-category'>Temperatura</span>
          </div>
          <span className='measure-data'>{renderMeasure(temperature)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='sensors'>
      {renderGenericCard('sensor', () => <MeasureLabel type='external' />)}
      {renderGenericCard('sensor', () => <MeasureLabel type='internal' />)}
    </div>
  )
}

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
  const deviceName = defaultDevice && defaultDevice.deviceName

  const { 
    lastMessage,
    readyState,
    } = useWebSocket(websocketUrl, {
    onMessage: (event) => console.log(event),
    onOpen: (event) => {
      console.log({
        event
      })
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
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    queryParams: {
      uiClient: token
    }}
  );

  const handleDeviceNonResponding = () => {
    setLoading(false)
    setError({ type: 'device'})
  }

  useEffect(() => {
    const receivedData = lastMessage && lastMessage.data
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
  }, [lastMessage])

  const renderPageContent = () => {
    const {
      defaultDeviceStatus,
      measures,
    } = deviceRealTimeData

    const StatusLabel = () => {
      if (loading) {
        return <LoadingIcon />
      }

      const shouldRenderOfflineLabel = error.type !== ''

      const offlineLabel = (
        shouldRenderOfflineLabel && <div>
          <div>
            <WiFiErrorIcon className='wifi-error-icon'/>
            <span>Offline</span>
          </div>
          {/* {<span className='reconnect-label'>Reconnecting </span>} */}
        </div>
      )

      return (
        <span
          className={`device-status device-status--${defaultDeviceStatus ? 'online' : 'offline'}`}>
          {defaultDeviceStatus ? 'Online' : offlineLabel}
        </span>
      )
    }

    const renderWebsocketConnectionStatus = () => {
      const containerClass = 'server-connection-status'
      const StatusIcon = () => {
        if (loading) {
          return <LoadingIcon />
        }

        switch (readyState) {
          case WsReadyState.OPEN:
            return <OnlineIcon className={`${containerClass}--online`}/>
          case WsReadyState.CONNECTING:
            return <LoadingIcon />
          default:
            return <OfflineIcon className={`${containerClass}--offline`}/>
        }
      }

      return (
        <div className='server-connection-status'>
          <h3>Conexão com o servidor:</h3>
          <StatusIcon />
        </div>
      )
    }

    return (
      <>
        <h2>Estação local</h2>
        {renderWebsocketConnectionStatus()}
        <GenericCard
          CustomData={StatusLabel}
          settingsButtonRoute='/configuracoes'
          label={deviceName} />
        <h2>Medições</h2>
        <div className='dashboard'>
          {renderMeasures(measures, loading)}
          <GenericCard
            settingsButtonRoute='configuracoes'
            type='watering'
            icon={cards['watering'].icon}
            label={cards['watering'].label}
            CustomData={() => 
              <WateringCardData
                deviceRealTimeData={deviceRealTimeData}
                device={defaultDevice}
                wsStatus={readyState} />} />
        </div>
      </>
    )
  }
  
  return(
    <div className='page-content home-view'>
      {renderPageContent()}
    </div>
  )
}