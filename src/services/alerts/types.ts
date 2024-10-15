import { ParamType } from 'types/enums'

export type FetchAlertsProps = { 
  token: string,
  deviceId?: string
}

export type CreateAlertProps = FetchAlertsProps & {
  sensorId: string,
  alertName: string,
  paramType: ParamType,
  value: string,
  operator: number
}

export type EditAlertProps = CreateAlertProps & { alertId: string}

export type DeleteAlertProps = FetchAlertsProps & {
  sensorId: string
  alertId: string
}
