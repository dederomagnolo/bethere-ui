import { ParamType } from "./enums";

export const getParamTypeFromNumber = (paramType: ParamType) => {
  switch (paramType) {
    case ParamType.TEMPERATURE:
      return 'temperature'
    case ParamType.RELATIVE_HUMIDITY:
      return 'humidity'
    case ParamType.MOISTURE:
      return 'moisture'
    default:
      return undefined
  }
}

export const convertParamTypeToNumber = (paramType: string) => {
  switch (paramType) {
    case 'temperature':
      return ParamType.TEMPERATURE
    case 'humidity':
      return ParamType.RELATIVE_HUMIDITY
    case 'moisture':
      return ParamType.MOISTURE
    default:
      return undefined
  }
}