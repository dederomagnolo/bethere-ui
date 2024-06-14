import { useState } from 'react'
import { useSelector } from 'react-redux'

import _ from 'lodash'
import {
  Button,
  Modal
} from 'components'

import { SENSORS } from 'global/consts'
import { fetchAlerts } from 'services/alerts'

import { getToken } from 'redux/user/selectors'
import { useFetch } from 'hooks/useFetch'

import './styles.scss'

import { ModalContent } from './blocks/modal-content'

export const AlertsConfig = ({ sensors, deviceId }: any ) => {
  const [showAlertForm,  setShowAlertForm] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(undefined) as any
  const token = useSelector(getToken)

  const {
    data
  } = useFetch(async () => await fetchAlerts({
    deviceId,
    token
  }), [deviceId])

  const alertsByDevice = _.get(data, 'data', [])

  const Alerts = () => {
    const mappedAlerts = _.map(alertsByDevice, (alert) => {
      const alertId = _.get(alert, '_id', '')
      const sensorId = _.get(alert, 'sensorId')
      const paramName = _.get(alert, 'paramName')
      const alertValue = _.get(alert, 'value')
      const alertName = _.get(alert, 'alertName')
      const operator = _.get(alert, 'operator')

      const alertSensor = _.find(sensors, (sensor) => sensor._id === sensorId)
      const model = _.get(alertSensor, 'model')
      const sensorName = _.get(alertSensor, 'name') || _.get(alertSensor, 'model')

      const sensorInfo = SENSORS[model] 
      const sensorParamsAvailable = _.get(sensorInfo, 'params')
      const translatedParamName = _.get(
        _.find(sensorParamsAvailable, (param) => param.type === paramName),
        'translatedTypeName'
      )

      return (
        <div
          key={alertId}
          className={`alert ${alertId === selectedAlert ? 'selected' : ''}`}
          onClick={() => {
            setShowAlertForm(true)
            setSelectedAlert(alert)
          }}>
          <span>
            {alertName}
          </span>
          <div className='alert__sensor-name'>
            Sensor: {sensorName}
          </div>
          <div className='alert__params'>
            <div>
              Parâmetro: {translatedParamName}
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
        <h4>Meus Alertas ({alertsByDevice.length})</h4>
        <div className='alerts-list__grid'>
          {mappedAlerts}
        </div>
      </div>
    )
  }

  return (
    <div className='options'>
      <div>
        <div className='description'>
          Configure o envio de alertas para o seu email caso um limite de medição seja atingido por um sensor.
          É possível configurar no máximo 6 alertas.
        </div>
        <Modal
          onRequestClose={() => {setShowAlertForm(false)}}
          isOpen={showAlertForm} >
          <ModalContent
            deviceId={deviceId}
            onClose={() => setSelectedAlert(null)}
            alertToEdit={selectedAlert}
            toggleModal={setShowAlertForm}
            sensors={sensors} />
        </Modal>
        <div className='alert-configs'>
          {alertsByDevice.length ? <Alerts /> : null}
          <Button
            disabled={alertsByDevice.length >= 6}
            className='alert-configs__button'
            onClick={() => setShowAlertForm(true)}>
            Novo Alerta
          </Button>
        </div>
      </div>
    </div>
  )
}