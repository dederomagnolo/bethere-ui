import React from 'react'
import {
  FaThermometerHalf as Thermometer,
  FaTint as Tint
} from 'react-icons/fa'

const cardTypes = {
  temperature: {
    label: 'Temperatura',
    labelIcon: () => <Thermometer />
  },
  humidity: {
    label: 'Umidade',
    labelIcon: () => <Tint />
  }
}

export const Card = () => {
  return (
    <div className='card'>e
      <div className='cardData'>

      </div>
      <div className='cardLabel'>

      </div>
    </div>
  )
}