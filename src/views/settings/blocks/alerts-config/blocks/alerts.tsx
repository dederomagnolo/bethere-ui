import _ from 'lodash'
import { SENSORS } from 'global/consts'

import { Alert, Sensor, Operators } from 'types/interfaces'


type AlertsListProps = {
  alerts: Alert[],
  sensors: Sensor[]
  handleAlertClick: Function
  selectedAlert: Alert
}

const getOperatorLabel = (operator: Operators | undefined) => {
  if (operator === Operators.GREATER_THAN) {
    return 'maior que'
  }

  return 'menor que'
}

export const Alerts = ({
  alerts,
  sensors,
  handleAlertClick,
  selectedAlert
}: AlertsListProps) => {
  const mappedAlerts = _.map(alerts, (alert) => {
    const alertId = alert._id
    const sensorId = alert.sensorId
    const paramType = alert.paramType
    const alertValue = alert.value
    const alertName = alert.alertName
    const operator = alert.operator
    const operatorLabel = getOperatorLabel(operator)

    const alertSensor = _.find(sensors, (sensor) => sensor._id === sensorId)
    const model = alertSensor?.model
    const sensorName = alertSensor?.name || model

    const sensorInfo = model ? SENSORS[model] : {}
    const sensorParamsAvailable = _.get(sensorInfo, 'params')

    const paramTypeInfos =
      _.find(sensorParamsAvailable, (param) => param.type === paramType)
    const unity = paramTypeInfos.unity
    const translatedParamType = paramTypeInfos.translatedTypeName || ''

    return (
      <div
        key={alertId}
        className={`alert ${alertId === selectedAlert._id ? 'selected' : ''}`}
        onClick={() => handleAlertClick(alert)}>
        <span>
          {alertName}
        </span>
        <div className='alert__sensor-name'>
          Sensor: {sensorName}
        </div>
        <div className='alert__params'>
          <div>
            Parâmetro: {translatedParamType}
          </div>
          <div>
            Limite: {operatorLabel} {alertValue}{unity}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className='alerts-list'>
      <h4>Meus Alertas ({alerts.length})</h4>
      <div className='alerts-list__grid'>
        {mappedAlerts}
      </div>
    </div>
  )
}