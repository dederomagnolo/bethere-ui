import React from 'react'
import _ from 'lodash'
import { 
  HiCog as Cog
} from 'react-icons/hi'

import '../styles.scss'
import './styles.scss'

interface CardLabelProps {
  label: string
}

interface GenericCardProps {
  className?: string
  settingsButtonAvailable?: boolean
  label?: string
  type?: string
  data?: any
}

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

const cards = {
  humidity: {
    type: 'data',
    label: 'Umidade',
    icon: () => {}
  },
  temperature: {
    type: 'data',
    label: 'Temperatura',
    icon: () => {}
  },
  watering: {
    type: 'watering',
    label: 'Irrigação',
    icon: () => {},
    data: WateringCardData
  }
}

const CardLabel = ({ label } : CardLabelProps) => {
  return (
    <div className='cardLabel'>
      <></>
      <span>{label}</span>
    </div>
  )
}

const GenericCard = ({
  type = 'default',
  className,
  settingsButtonAvailable,
  data,
  label
} : GenericCardProps) => {
  const mockedStatusLabel = 'Online'

  const renderSettingsButton = () => settingsButtonAvailable && <Cog />
  const renderCustomData = () => data ? data() : mockedStatusLabel
  const labelToRender = label ? label : _.get(cards, `${type}.label`)

  return (
    <div className={`genericCard ${className}`}>
      <div className='infos'>
        {renderSettingsButton()}
        <CardLabel label={labelToRender} />
      </div>
      <div className='data'>
        {renderCustomData()}
      </div>
    </div>
  )
}

const renderPageContent = () => {
  const mockDeviceName = 'Jardim 1'
  return (
    <>
      <GenericCard settingsButtonAvailable label={mockDeviceName} />
      <div className='sensors'>
        <GenericCard type='humidity' />
      </div>
      <GenericCard type='watering' />
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