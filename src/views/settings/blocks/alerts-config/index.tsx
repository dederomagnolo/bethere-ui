import { useState, useEffect } from 'react'
import _ from 'lodash'
import { Button, CustomSelect, Input } from 'components'

import { SENSORS } from 'global/consts'
import { InputOption } from 'views/settings/input-option'

import './styles.scss'
import { useSelector } from 'react-redux'
import { getToken } from 'redux/user/selectors'

import { useFetch } from 'hooks/useFetch'
import { fetchAlerts } from 'services/fetch'

export const AlertsConfig = ({ sensors, deviceId }: any) => {
  const [showNewAlertForm,  setShowNewAlertForm] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState({ _id: '', model: '' })
  const token = useSelector(getToken)

  const {
    data
  } = useFetch(async () => await fetchAlerts({
    deviceId,
    token
  }), [deviceId])

  const getSensorParamOptions = () => {
    const model = selectedSensor.model
    const sensorInfoByModel = SENSORS[model] || {}

    const modelTypesAvailable = _.get(sensorInfoByModel, 'params')
    return _.map(modelTypesAvailable, (param) => ({
      value: param.type,
      label: param.translatedTypeName
    }))
  }

  const sensorOptions = _.map(sensors, (sensor) => ({
    value: sensor._id,
    label: sensor.name || sensor.serialKey
  }))

  const handleSelectedSensorChange = ({ value: selectedSensorId }: any) => {
    const sensorById = _.find(sensors, (sensor) => sensor._id === selectedSensorId)
    setSelectedSensor(sensorById)
  }

  const ButtonComponents = () => {
    return (
      <div className='alert-form__button-components'>
        <Button
          className='alert-configs__button'>
          Salvar
        </Button>
        <Button
          onClick={() => setShowNewAlertForm(false)}
          className='alert-configs__button'
          variant='cancel'>
            Cancelar
        </Button>
      </div>
    )
  }

  const Alerts = () => {
    const alertsByDevice = _.get(data, 'data')
    const mappedAlerts = _.map(alertsByDevice, (alert) => {
      console.log({alert})
      const sensorId = _.get(alert, 'sensorId')
      const paramName = _.get(alert, 'paramName')
      const alertValue = _.get(alert, 'value')

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
        <div>
          <div>{sensorName}</div>
          <div>{translatedParamName}</div>
          <div>{alertValue}</div>
        </div>
      )
    })

    return (
      <div className='alerts-list'>
        {mappedAlerts}
      </div>
    )
  }

  return (
    <div className='options options'>
      <div>
        <div className='alerts-configs'>
          <Alerts />
        </div>
        <div className='description'>
          Configure o envio de alertas para o seu email caso um limite de medição seja atingido por um sensor.
        </div>
        {showNewAlertForm ? (
          <div className='alert-configs'>
            <div className='alert-configs__new-alert-title'>Configuração de novo alerta</div>
            <div className='alert-form'>
              <div className='input-option'>
                <div className='title'>Sensor</div>
                <CustomSelect
                  defaultValue={sensorOptions && sensorOptions[0]}
                  options={sensorOptions}
                  onChange={handleSelectedSensorChange} />
              </div>
              <div className='input-option'>
                <div className='title'>Parâmetros disponíveis</div>
                <CustomSelect
                  defaultValue={getSensorParamOptions()[0]}
                  options={getSensorParamOptions()} />
              </div>
              <InputOption
                showEditAndSave={false}
                onChange={() => {}}
                title='Limite para disparo do alerta' />
              <ButtonComponents />
            </div>
          </div>
        ) : (
          <Button
            className='alert-configs__button'
            onClick={() => setShowNewAlertForm(true)}>
            Novo Alerta
          </Button>
        )}
      </div>
    </div>
  )
}