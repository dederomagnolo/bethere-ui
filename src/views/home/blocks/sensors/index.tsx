import _ from 'lodash'
import {
  FaTint as TintIcon,
  FaThermometerHalf as ThermometerIcon,
} from 'react-icons/fa'

import { GenericCard } from 'components'

import { SENSORS } from 'global/consts'

import { LoadingIcon } from '../loading-icon'

import { CARDS } from '../../utils/constants'
import { UnavailableConnection } from '../unavailable-connection'

import './styles.scss'
import { Sensor } from 'types/interfaces'

type SensorsProps = {
  sensors: Sensor[]
  measures: any
  isDeviceConnected: boolean
  isDeviceWaitingUpdate: boolean
}

export const Sensors = ({
  sensors,
  measures = [],
  isDeviceConnected,
  isDeviceWaitingUpdate
}: SensorsProps) => {
  const renderMeasure = (data: number | string, unit: string) => {
    return isDeviceWaitingUpdate ? <LoadingIcon /> : (
      <div className='measure-data'>
        <span>{data}</span>
        <span className='unit'>{unit}</span>
      </div>
    )
  }

  const MeasureCardContent = ({ sensorModel, measuresBySensor, sensorId }: any ) => {
    const MeasuresBySensor = () => {
      const humidity = _.get(measuresBySensor, 'humidity') 
      const temperature = _.get(measuresBySensor, 'temperature')
      const moisture = _.get(measuresBySensor, 'moisture')

      if (sensorModel === 'SHT20') {
        return (
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
      }
      
      if (sensorModel === 'HD38') {
        const outMax = 100
        const outMin = 0
        const inMax = 270
        const inMin = 556

        const normalizedValue = 
          ((Number(moisture) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

        return (
          <div className='measures' key={sensorId}>
            <div className='measure'>
              <div className='measure-label'>
                <TintIcon className='measure-icon--humidity' />
                <span className='measure-category'>Umidade do solo</span>
              </div>
              {renderMeasure(normalizedValue.toFixed(2), '%')}
            </div>
          </div>
        )
      }

      return null
    }

    return isDeviceConnected
      ? <MeasuresBySensor />
      : <UnavailableConnection />
  }

  const mappedSensorCards = _.map(sensors, (sensor) => {
    const isEnabled = sensor.enabled
    if (!isEnabled) return null
  
    const serialKey = _.get(sensor, 'serialKey', '')
    const sensorModel = _.get(sensor, 'model')
    const sensorId = _.get(sensor, '_id')
    const enabled = _.get(sensor, 'enabled')

    const broadcastedSensors = _.keys(measures)
    const broadcastedMeasures = broadcastedSensors.includes(serialKey) ? measures[serialKey] : null

    const errorValue = SENSORS[sensor.model].errorValue

    const cardStructureByModel = CARDS[sensorModel]

    return (
      <GenericCard
        {...cardStructureByModel}
        key={sensorId}
        type={sensorModel}
        CustomData={() => (
          <MeasureCardContent
            enabled={enabled}
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