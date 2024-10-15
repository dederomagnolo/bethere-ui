import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { Checkbox, CustomSelect } from 'components'

import { createAlert, deleteAlert, editAlert } from 'services/alerts'

import { InputOption } from 'views/settings/input-option'
import { getToken } from 'redux/user/selectors'
import { Alert, Sensor } from 'types/interfaces'
import { allowOnlyNumbers } from 'lib/validations'
import { Actions } from './actions'
import { getSensorParamsSelectOptions, sensorSelectOptions } from 'views/settings/functions'

type SelectOptions = {
  label: string
  value: any
}

const getDefaultValues = ({ 
  alertToEdit,
  sensorOptions,
  paramOptions
}: { alertToEdit: Alert, sensorOptions: SelectOptions[], paramOptions: SelectOptions[]}) => {

  if (alertToEdit._id === '') {
    return {
      sensor: sensorOptions && sensorOptions[0],
      param: paramOptions && paramOptions[0]
    }
  }

  const { paramType, sensorId } = alertToEdit
  
  const sensorToShow = sensorOptions.find((option) => option.value === sensorId)
  const paramToShow = paramOptions.find((option) => option.value === paramType)

  return {
    sensor: sensorToShow || sensorOptions[0] ,
    param: paramToShow || paramOptions[0]
  }
}

export const ModalContent = ({
  sensors,
  onClose,
  toggleModal,
  deviceId,
  alertToEdit,
  onUpdate
}: any) => {
  const token = useSelector(getToken)
  const sensorOptions = sensorSelectOptions(sensors)
  const isNewAlert = alertToEdit._id === ''

  const [selectedSensor, setSelectedSensor] = useState(sensors[0])
  const [paramOptions, setSensorParamOptions] = useState(
    getSensorParamsSelectOptions(selectedSensor.model)
  )

  const [defaultValues, setSelectDefaultValues] = useState(
    getDefaultValues({
      paramOptions,
      sensorOptions,
      alertToEdit
    })
  )

  const [alertParams, setAlertParams] = useState(alertToEdit)

  const [fieldsTouched, setFieldsTouched] = useState({
    selectedSensor: false,
    alertName: false,
    paramType: false,
    operator: false,
    value: false
  })

  const [errors, setErrors] = useState({ 
    value: false,
    selectedSensor: false,
    operator: false,
  })

  useEffect(() => {
    const updatedParamOptions = getSensorParamsSelectOptions(selectedSensor.model)
    setSensorParamOptions(updatedParamOptions)
    const updatedDefaultValues = getDefaultValues({
      paramOptions: updatedParamOptions,
      sensorOptions,
      alertToEdit
    })
    setSelectDefaultValues(updatedDefaultValues)

    setAlertParams({
      ...alertParams,
      paramType: updatedDefaultValues.param?.value
    })
  }, [selectedSensor])

  const validateFields = () => {
    const { value, operator } = alertParams

    let errorsToSet = errors
    
    if (fieldsTouched.value) {
      errorsToSet = {...errorsToSet, value: value === undefined || value === ''}
    }

    if (fieldsTouched.operator) {
      errorsToSet = {...errorsToSet, operator: operator === undefined}
    }

    if (fieldsTouched.selectedSensor) {
      errorsToSet = {...errorsToSet, selectedSensor: !selectedSensor}
    }

    return errorsToSet
  }

  useEffect(() => {
    const errorsToSet = validateFields()
    setErrors(errorsToSet)
  }, [fieldsTouched, alertParams])

  const handleTouchField = (fieldName: string) => {
    setFieldsTouched({ ...fieldsTouched, [fieldName]: true})
  }

  const handleSelectedSensorChange = ({ value: selectedSensorId }: SelectOptions) => {
    const sensorById = _.find(sensors, (sensor) => sensor._id === selectedSensorId)
    setSelectedSensor(sensorById)
  }

  const handleSelectedParamTypeChange = ({ value }: SelectOptions) => {
    setAlertParams({...alertParams, paramType: value})
  }
  
  const handleParamValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = allowOnlyNumbers(e.target.value)
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
    const action = isNewAlert ? createAlert : editAlert
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

  return (
    <div className='alert-configs'>
      <div className='alert-configs__modal-title'>
        {isNewAlert ? 'Novo alerta' : 'Editar alerta'}
      </div>
      <div className='alert-form'>
        <div className='input-option'>
          <div className='title'>Sensor</div>
          <CustomSelect
            name='selectedSensor'
            // onBlur={() => handleTouchField('selectedSensor')}
            defaultValue={defaultValues.sensor}
            options={sensorOptions}
            onChange={handleSelectedSensorChange} />
        </div>
        <InputOption
          name='alert-name'
          className='name-input'
          showEditAndSave={false}
          value={alertParams.alertName}
          onChange={handleAlertNameChange}
          title='Nome do alerta (opcional)' />
        <div className='input-option'>
          <div className='title'>Parâmetros disponíveis</div>
          <CustomSelect
            name='paramType'
            value={paramOptions.find((option) => option.value === alertParams.paramType)}
            onChange={handleSelectedParamTypeChange}
            defaultValue={defaultValues.param}
            options={paramOptions} />
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
          name='alert-param-value'
          onBlur={() => handleTouchField('value')}
          error={errors.value ? '*Campo obrigatório' : ''}
          inputMode='numeric'
          min={0}
          type='text'
          className='param-value-input'
          showEditAndSave={false}
          value={alertParams.value}
          onChange={handleParamValueChange}
          title='Limite para disparo do alerta' />
        <Actions
          onSave={saveChanges}
          onDelete={() => {
            handleDeleteAlert()
            toggleModal(false)
            setSelectedSensor({ _id: '', model: '' })
            onClose()
          }}
          onCancel={() =>{
            toggleModal(false)
            setSelectedSensor({ _id: '', model: '' })
            onClose()
          }}
          showDelete={!isNewAlert}
        />
      </div>
    </div>
  )
}