import React, { useEffect, useState } from 'react'
import Switch from 'react-switch';
import { useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import _ from 'lodash'

import { GenericCard } from '../../components/card'

import {
  FaTint as Tint,
  FaThermometerHalf as Thermometer,
  FaLeaf as Leaf
} from 'react-icons/fa'

import { getToken } from '../../redux/user/selectors'
import { getUserDevices } from '../../redux/device/selectors'

import '../styles.scss'
import './styles.scss'

const websocketUrl = 'ws://localhost:8080';

const WateringCardData = () => {
  return (
    <div className='wateringCardData'>
      <div className='option'>
        <span>Status</span>
        <span>Online</span>
      </div>
      <div className='option'>
        <Switch 
          checked={true}
          onChange={() => {}}
        />
        <span>Auto</span>
      </div>
      <div className='option'>
          <Switch 
            checked={true}
            onChange={() => {}}
          />
        <span>Manual</span>
      </div>
    </div>
  )
}

const cards: any = {
  humidity: {
    label: 'Umidade',
    icon: Tint
  },
  temperature: {
    label: 'Temperatura',
    icon: Thermometer
  },
  watering: {
    label: 'Irrigação',
    icon: Leaf,
  }
}

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

const renderMeasures = (measures: any) => { // type here
  const MeasureLabel = () => {
    const internalHumidity = _.get(measures, 'internalHumidity')
    const externalHumidity = _.get(measures, 'externalHumidity')
    const internalTemperature = _.get(measures, 'internalTemperature')
    const externalTemperature = _.get(measures, 'externalTemperature')
    
    return (
      <div className='measures'>
        <div>
          <span>Interna</span>
          <span>{internalHumidity}</span>
        </div>
        <div>
          <span>Externa</span>
          <span>{externalHumidity}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='sensors'>
      {renderGenericCard('humidity', MeasureLabel)}
      {renderGenericCard('temperature', MeasureLabel)}
    </div>
  )

}


export const Home = () => {
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const [defaultDeviceStatus, setDefaultDeviceStatus] = useState(false)
  const [dynamicMeasures, setDynamicMeasures] = useState([])

  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const deviceName = defaultDevice && defaultDevice.deviceName

  const { 
    sendMessage,
    lastJsonMessage,
    lastMessage,
    readyState,
    } = useWebSocket(websocketUrl, {
    onMessage: (event) => console.log(event),
    onOpen: () => console.log(`Connected to WebSocket Server`),
    onError: (event) => { console.error(event); },
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
    queryParams: {
      uiClient: token 
    }}
  );

  useEffect(() => {
    const receivedData = lastMessage && lastMessage.data
    const parsedData = JSON.parse(receivedData)

    const userConnectedDevices = parsedData && parsedData.connectedDevices
    const measures = parsedData && parsedData.measures
    setDynamicMeasures(measures)
   
    let connectedDeviceData // lets type devices!

    _.every(userConnectedDevices, (connectedDevice) => {
      const existsInUserCollection =
        _.find(userDevices, (userDevice) => connectedDevice === userDevice.deviceSerialKey)
      connectedDeviceData = existsInUserCollection
      return existsInUserCollection
    })

    const isConnectedDeviceDefault = _.get(connectedDeviceData, 'defaultDevice')
    
    if(userConnectedDevices && userConnectedDevices.length && isConnectedDeviceDefault) {
      setDefaultDeviceStatus(true)
    } else {
      setDefaultDeviceStatus(false)
    }
  }, [lastMessage])

  const renderPageContent = () => {

    const StatusLabel = () =>
      <span
        className={`device-status device-status--${defaultDeviceStatus ? 'online' : 'offline'}`}>
          {defaultDeviceStatus ? 'Online' : 'Offline'}
      </span>

    return (
      <>
        <h2>Estação local</h2>
        <GenericCard
          CustomData={StatusLabel}
          settingsButtonAvailable
          label={deviceName} />
        <h2>Medições</h2>
        <div className='dashboard'>
          {renderMeasures(dynamicMeasures)}
          {renderGenericCard('watering', WateringCardData)}
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