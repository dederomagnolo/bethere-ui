import React from 'react'
import Switch from 'react-switch';
import useWebSocket from 'react-use-websocket';

import { GenericCard } from '../../components/card'

import {
  FaTint as Tint,
  FaThermometerHalf as Thermometer,
  FaLeaf as Leaf
} from 'react-icons/fa'

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
    data: WateringCardData
  }
}

const renderGenericCard = (type: string) => {
  const { label, icon, data } = cards[type]
  return (
    <GenericCard
      type={type}
      icon={icon}
      label={label}
      data={data} />
  )
}

const renderPageContent = () => {
  const mockDeviceName = 'Jardim 1'
  return (
    <>
      <h2>Dispositivo</h2>
      <GenericCard
        settingsButtonAvailable
        label={mockDeviceName} />
      <h2>Resumo</h2>
      <div className='dashboard'>
        <div className='sensors'>
          {renderGenericCard('humidity')}
          {renderGenericCard('temperature')}
        </div>
        {renderGenericCard('watering')}
      </div>
    </>
  )
}

export const Home = () => {
  const { 
    sendMessage,
    lastJsonMessage,
    lastMessage,
    readyState,
    } = useWebSocket(websocketUrl, {
      onOpen: () => console.log(`Connected to WebSocket Server`),
      onError: (event) => { console.error(event); },
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000,
      queryParams: {
        uiClient: "token"
      }
  });

  return(
    <div className='pageContent home-view'>
      <h1>Home</h1>
      {renderPageContent()}
    </div>
  )
}