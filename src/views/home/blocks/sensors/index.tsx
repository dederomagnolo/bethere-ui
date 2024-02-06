import _ from 'lodash'
import {
  FaTint as TintIcon,
  FaThermometerHalf as ThermometerIcon,
} from 'react-icons/fa'

import {
  TbCircleFilled as OnlineIcon,
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import { GenericCard } from 'components'

import { SENSORS } from 'global/consts'

import { LoadingIcon } from '../loading-icon'

import { CARDS } from '../../utils/constants'


import './styles.scss'

export const Sensors = ({ sensors, measures = [], loading, isDeviceOffline }: any) => {
  const MeasureCardContent = ({ sensorModel, measuresBySensor, sensorId }: any ) => {
    if (sensorModel === 'SHT20') {
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
        isDeviceOffline || !measuresBySensor ? (
          <div className='measures unavalible'>
            <OfflineIcon />
            <p>Indisponível</p>
          </div>
        ) : (
          <div className='measures' key={sensorId}>
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
    const sensorModel = _.get(sensor, 'model')
    const sensorId = _.get(sensor, '_id')

    const broadcastedSensors = _.keys(measures)
    const broadcastedMeasures = broadcastedSensors.includes(serialKey) ? measures[serialKey] : null

    const errorValue = SENSORS[sensor.model].errorValue

    const sensorMeasuresWithErrorsMapped = _.map(broadcastedMeasures, (broadcastedValue, key) =>
    ({ [key]: broadcastedValue, error: broadcastedValue === errorValue }) )

    const cardStructureByModel = CARDS[sensorModel]

    return (
      <GenericCard
        {...cardStructureByModel}
        type={sensorModel}
        CustomData={() => (
          <MeasureCardContent
            sensorId={sensorId}
            sensorModel={sensorModel}
            measuresBySensor={broadcastedMeasures} />
        )} />)
  })

  return (
    <div className='sensors'>
      {mappedSensorCards}
    </div>
  )
}