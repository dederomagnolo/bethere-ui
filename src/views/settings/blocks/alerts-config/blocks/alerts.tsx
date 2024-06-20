import _ from 'lodash'
import { SENSORS } from 'global/consts'

export const Alerts = ({
  alerts,
  sensors,
  handleAlertClick,
  selectedAlert
}: any) => {
  const mappedAlerts = _.map(alerts, (alert) => {
    const alertId = _.get(alert, '_id', '')
    const sensorId = _.get(alert, 'sensorId')
    const paramType = _.get(alert, 'paramType')
    const alertValue = _.get(alert, 'value')
    const alertName = _.get(alert, 'alertName')
    const operator = _.get(alert, 'operator')

    const alertSensor = _.find(sensors, (sensor) => sensor._id === sensorId)
    const model = _.get(alertSensor, 'model')
    const sensorName = _.get(alertSensor, 'name') || _.get(alertSensor, 'model')

    const sensorInfo = SENSORS[model] 
    const sensorParamsAvailable = _.get(sensorInfo, 'params')
    const translatedParamType = _.get(
      _.find(sensorParamsAvailable, (param) => param.type === paramType),
      'translatedTypeName'
    )

    return (
      <div
        key={alertId}
        className={`alert ${alertId === selectedAlert ? 'selected' : ''}`}
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
            Limite: {alertValue}
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