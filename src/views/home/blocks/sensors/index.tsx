import _ from 'lodash'
import {
  FaTint as TintIcon,
  FaThermometerHalf as ThermometerIcon,
} from 'react-icons/fa'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import { LoadingIcon } from '../loading-icon'
import { GenericCard } from 'components'
import { CARDS } from '../../utils/constants'

import './styles.scss'

const renderGenericCard = (type: string, CustomData?: any) => {
  const { label, icon } = CARDS[type]
  return (
    <GenericCard
      // settingsButtonRoute='configuracoes'
      type={type}
      icon={icon}
      label={label}
      CustomData={CustomData} />
  )
}

export const Sensors = ({ sensors, measures = [], loading, isDeviceOffline }: any) => {// type here
  const MeasureLabel = ({ type, measuresBySensor }: any ) => {
    if (type === 'SHT20') {
      const humidity = _.get(measuresBySensor, 'humidity') 
      const temperature = _.get(measuresBySensor, 'temperature')

      const renderMeasure = (data: number, unit: string) => {
        return loading ? <LoadingIcon /> : (
          <div className='measure-data'>
            <span>{data}</span>
            <span className='unit'>{unit}</span>
          </div>
        )
      }

      return (
        isDeviceOffline ? (
          <div className='measures unavalible'>
            <OfflineIcon />
            <p>Indisponível</p>
          </div>
        ) : (
          <div className='measures' key={type}>
            <div className='measure'>
              <div className='measure-label'>
                <TintIcon className='measure-icon--humidity' />
                <span className='measure-category'>Umidade</span>
              </div>
              {renderMeasure(humidity, '%')}
            </div>
            <div className='measure'>
              <div className='measure-label'>
                <ThermometerIcon className='measure-icon--temperature' />
                <span className='measure-category'>Temperatura</span>
              </div>
              {renderMeasure(temperature, '°C')}
            </div>
          </div>
        )
      )
    }
    return null
  }

  const mappedSensorCards = _.map(sensors, (sensor) => {
    const serialKey = _.get(sensor, 'serialKey', '')
    const broadcastedSensors = _.keys(measures)
    const broadcastedMeasures = broadcastedSensors.includes(serialKey) ? measures[serialKey] : null

    return renderGenericCard(
      sensor.model,
      () => <MeasureLabel type={sensor.model} measuresBySensor={broadcastedMeasures} />)
  })

  return (
    <div className='sensors'>
      {mappedSensorCards}
    </div>
  )
}