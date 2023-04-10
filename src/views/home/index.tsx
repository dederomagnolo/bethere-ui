import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import _ from 'lodash'

import { GenericCard } from '../../components/card'
import { WateringCardData } from './blocks/watering-card-data'

import BeatLoader from 'react-spinners/BeatLoader'

import { getToken } from '../../redux/user/selectors'
import { getUserDevices } from '../../redux/device/selectors'

import {
  RiSignalWifiErrorFill as WiFiErrorIcon
} from 'react-icons/ri'

import {
  MdOutlineSpeakerPhone as BroadcastingIcon,
  MdOutlinePhonelinkErase as OfflineBroadcastIcon
} from 'react-icons/md'

import { cards } from './utils/constants'

import '../styles.scss'
import './styles.scss'

const websocketUrl = 'ws://localhost:8080';

const renderGenericCard = (type: string, CustomData?: any) => {
  const { label, icon } = cards[type]
  return (
    <GenericCard
      type={type}
      icon={icon}
      label={label}
      CustomData={CustomData} />
  )
}

const renderMeasures = (measures: any, loading: boolean) => { // type here
  const MeasureLabel = ({ type }: { type: any } ) => {
    let internal = _.get(measures, 'internalHumidity') 
    let external = _.get(measures, 'externalHumidity')

    if (type == 'temperature') {
      internal = _.get(measures, 'internalTemperature')
      external = _.get(measures, 'externalTemperature')
    }

    const renderMeasure = (data: number) => {
      return loading ? <BeatLoader size={5} /> : <span>{data}</span>
    }
    
    return (
      <div className='measures' key={type}>
        <div className='measure'>
          <span className='measure-category'>Interna</span>
          <span className='measure-data'>{renderMeasure(internal)}</span>
        </div>
        <div className='measure'>
          <span className='measure-category'>Externa</span>
          <span className='measure-data'>{renderMeasure(external)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='sensors'>
      {renderGenericCard('humidity', () => <MeasureLabel type='humidity' />)}
      {renderGenericCard('temperature', () => <MeasureLabel type='temperature' />)}
    </div>
  )
}

export const Home = () => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
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
    onOpen: () => {
      console.log(`Connected to WebSocket Server`)
      setLoading(true)
    },
    onError: (event) => { console.error(event); },
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000000000,
    queryParams: {
      uiClient: token 
    }}
  );

  const handleDeviceNonResponding = () => {
    setLoading(false)
    setError(true)
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
    }
  }, [lastMessage])

  const renderPageContent = () => {
    const {
      defaultDeviceStatus,
      measures,
    } = deviceRealTimeData

    const StatusLabel = () => {
      if (loading) {
        return <BeatLoader size={10} />
      }

      const offlineLabel = (
        <div>
          <div>
            {error && <WiFiErrorIcon className='wifi-error-icon'/>}
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

    return (
      <>
        <h2>Estação local</h2>
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