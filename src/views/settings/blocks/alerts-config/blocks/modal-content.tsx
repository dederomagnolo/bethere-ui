import { useState, useEffect } from 'react'
import _ from 'lodash'
import { Button, Checkbox, CustomSelect } from 'components'
import { InputOption } from 'views/settings/input-option'
import { SENSORS } from 'global/consts'
import { createAlert, deleteAlert, editAlert } from 'services/alerts'
import { getToken } from 'redux/user/selectors'
import { useSelector } from 'react-redux'

import { FaTrashAlt as TrashIcon } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'

export const ModalContent = ({
  sensors,
  onClose,
  toggleModal,
  deviceId,
  alertToEdit,
  onUpdate
}: any) => {
  const token = useSelector(getToken)
  const [selectedSensor, setSelectedSensor] = useState(sensors[0])

  const model = selectedSensor.model 
  const sensorInfoByModel = SENSORS[model] || {}
  
  const modelTypesAvailable = _.get(sensorInfoByModel, 'params')
  const sensorParamOptions = _.map(modelTypesAvailable, (param) => ({
      value: param.type,
      label: param.translatedTypeName
    }))

  const sensorOptions = _.map(sensors, (sensor) => ({
    value: sensor._id,
    label: sensor.name || sensor.serialKey
  }))

  const getDefaultValues = () => {
    if (!alertToEdit) {
      return {
        sensor: sensorOptions && sensorOptions[0],
        param: sensorParamOptions && sensorParamOptions[0]
      }
    }

    const { paramType, sensorId } = alertToEdit
    
    const sensorToShow = sensorOptions.find((option) => option.value === sensorId)
    const paramToShow = sensorParamOptions.find((option) => option.value === paramType)

    return {
      sensor: sensorToShow,
      param: paramToShow
    }
  }

  const defaultValues = getDefaultValues() 
  const [alertParams, setAlertParams] = useState(alertToEdit || {
    value: '',
    paramType: defaultValues.param?.value,
    alertName: '',
    operator: 0
  })

  const handleSelectedSensorChange = ({ value: selectedSensorId }: any) => {
    const sensorById = _.find(sensors, (sensor) => sensor._id === selectedSensorId)
    setSelectedSensor(sensorById)
  }

  const handleSelectedParamTypeChange = ({ value }: any) => {
    setAlertParams({...alertParams, paramType: value})
  }

  const handleParamValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAlertParams({...alertParams, value})
  }

  const handleAlertNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAlertParams({...alertParams, alertName: value})
  }

  const handleDeleteAlert = async () => {
    const { deviceId } = alertParams

    const updatedAlerts = await deleteAlert({
      token,
      deviceId,
      sensorId: selectedSensor._id,
      alertId: alertToEdit._id
    })

    if (updatedAlerts) {
      const dataToUpdate = updatedAlerts.data
      onUpdate && onUpdate(dataToUpdate)
    }

    setTimeout(() => toggleModal(false), 2000)
  }

  const saveChanges = async () => {
    const action = alertToEdit ? editAlert : createAlert
    const { alertName, paramType, value, operator } = alertParams
    const updatedAlerts = await action({
      token,
      deviceId,
      sensorId: selectedSensor._id,
      alertName,
      paramType,
      value,
      operator,
      alertId: alertToEdit?._id || null
    })

    if (updatedAlerts) {
      const dataToUpdate = updatedAlerts.data
      onUpdate && onUpdate(dataToUpdate)
      setTimeout(() => toggleModal(false), 1000) 
    }
  }
  
  const ButtonComponents = () => {
    return (
      <div className='alert-form__button-components'>
        <div className='alert-form__button-components__main'>
          <Button
            onClick={saveChanges}
            className='alert-configs__button'>
            Salvar
          </Button>
          <Button
            onClick={() =>{
              toggleModal(false)
              setSelectedSensor({ _id: '', model: '' })
              onClose()
            }}
            className='alert-configs__button'
            variant='cancel'>
              Cancelar
          </Button>
        </div>
        <div className='alert-form__button-components__delete'>
          <Tooltip id='app-tooltip' anchorSelect={`#alert-delete-button`}>
            Excluir alerta
          </Tooltip>
          <Button
            id='alert-delete-button'
            onClick={() => {
              handleDeleteAlert()
              toggleModal(false)
              setSelectedSensor({ _id: '', model: '' })
              onClose()
            }}
            variant='cancel'>
              <TrashIcon />
          </Button>
        </div>
      </div>
    )
  }


  return (
    <div className='alert-configs'>
      <div className='alert-configs__new-alert-title'>
        {alertToEdit ? 'Editar alerta' : 'Novo alerta'}
      </div>
      <div className='alert-form'>
        <div className='input-option'>
          <div className='title'>Sensor</div>
          <CustomSelect
            defaultValue={defaultValues.sensor}
            options={sensorOptions}
            onChange={handleSelectedSensorChange} />
        </div>
        <InputOption
          className='name-input'
          showEditAndSave={false}
          value={alertParams.alertName}
          onChange={handleAlertNameChange}
          title='Nome do alerta (opcional)' />
        <div className='input-option'>
          <div className='title'>Parâmetros disponíveis</div>
          <CustomSelect
            onChange={handleSelectedParamTypeChange}
            defaultValue={defaultValues.param}
            options={sensorParamOptions} />
        </div>
        <div className='limit-options__container'>
          <Checkbox
            radio
            name='less-than'
            checked={alertParams.operator === 0}
            initialState={alertParams.operator === 0}
            label='Menor que'
            onChange={() => setAlertParams({...alertParams, operator: 0})} />
          <Checkbox
            radio
            checked={alertParams.operator === 1}
            name='greater-than'
            initialState={alertParams.operator === 1}
            label='Maior que'
            onChange={() => setAlertParams({...alertParams, operator: 1})} />
        </div>
        <InputOption
          name='param-value'
          className='param-value-input'
          showEditAndSave={false}
          value={alertParams.value}
          onChange={handleParamValueChange}
          title='Limite para disparo do alerta' />
        <ButtonComponents />
      </div>
    </div>
  )
}