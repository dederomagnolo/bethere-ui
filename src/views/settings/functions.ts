import _ from 'lodash'
import { SENSORS } from 'global/consts'
import { Operators, Sensor } from 'types/interfaces'
import { convertParamTypeToNumber } from 'types/functions';


export const getTimeOptions = () => {
  const timeOptions = [] as any;

  for (let i = 0; i < 24; i++) {
    timeOptions.push({
      value: i,
      label: `${i}h`,
    });
  }

  return timeOptions
}

export const getOperatorLabel = (operator: Operators | undefined) => {
  if (operator === Operators.GREATER_THAN) {
    return 'maior que'
  }

  return 'menor que'
}

export const getSensorParamsSelectOptions = (model: string) => {
  const sensorInfoByModel = SENSORS[model] || {}

  const modelTypesAvailable = _.get(sensorInfoByModel, 'params')
  const sensorParamOptions = _.map(modelTypesAvailable, (param) => ({
    value: convertParamTypeToNumber(param.type), //TODO: migrate type from measures to remove this kind of conversion
    label: param.translatedTypeName
  }))

  return sensorParamOptions
}

export const sensorSelectOptions = (sensors: Sensor[]) => _.map(sensors, (sensor) => ({
  value: sensor._id,
  label: sensor.name || sensor.serialKey
}))