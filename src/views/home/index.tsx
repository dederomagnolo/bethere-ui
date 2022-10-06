import React from 'react'

import { GenericCard } from '../../components/card'

import {
  FaTint as Tint,
  FaThermometerHalf as Thermometer,
  FaLeaf as Leaf
} from 'react-icons/fa'

import '../styles.scss'
import './styles.scss'

const WateringCardData = () => {
  return (
    <div className='wateringCardData'>
      <div className='option'>
        <span>Status</span>
        <span>Online</span>
      </div>
      <div className='option'>
        <span>Auto</span>
      </div>
      <div className='option'>
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
  return(
    <div className='pageContent homeView'>
      <h1>Home</h1>
      {renderPageContent()}
    </div>
  )
}