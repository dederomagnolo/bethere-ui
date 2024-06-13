import { useState } from 'react'
import _ from 'lodash'
import { Button, CustomSelect } from 'components'
import { InputOption } from 'views/settings/input-option'
import { SENSORS } from 'global/consts'
import { createAlert } from 'services/fetch'
import { getToken } from 'redux/user/selectors'
import { useSelector } from 'react-redux'

export const ModalContent = ({
  sensors,
  onClose,
  toggleModal,
  deviceId,
  sensorToEdit
}: any) => {
  const token = useSelector(getToken)
  const sensorOptions = _.map(sensors, (sensor) => ({
    value: sensor._id,
    label: sensor.name || sensor.serialKey
  }))

  const [selectedSensor, setSelectedSensor] = useState(sensors[0])
  const [alertParams, setAlertParams] = useState({
    value: '',
    paramName: '',
    alertName: ''
  })

  const handleSelectedSensorChange = ({ value: selectedSensorId }: any) => {
    const sensorById = _.find(sensors, (sensor) => sensor._id === selectedSensorId)
    setSelectedSensor(sensorById)
  }

  const handleParamValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAlertParams({...alertParams, value})
  }

  const getSensorParamOptions = () => {
    const model = selectedSensor.model 
    const sensorInfoByModel = SENSORS[model] || {}

    const modelTypesAvailable = _.get(sensorInfoByModel, 'params')
    return _.map(modelTypesAvailable, (param) => ({
      value: param.type,
      label: param.translatedTypeName
    }))
  }

  const saveChanges = async () => {
    const { alertName, paramName, value } = alertParams
    const updatedAlerts = await createAlert({
      token,
      deviceId,
      sensorId: selectedSensor._id,
      alertName,
      paramName,
      value
    })

    console.log({updatedAlerts})
  }
  
  const ButtonComponents = () => {
    return (
      <div className='alert-form__button-components'>
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
    )
  }

  return (
    <div className='alert-configs'>
      <div className='alert-configs__new-alert-title'>
        {sensorToEdit ? 'Editar alerta' : 'Novo alerta'}
      </div>
      <div className='alert-form'>
        <div className='input-option'>
          <div className='title'>Sensor</div>
          <CustomSelect
            defaultValue={sensorOptions && sensorOptions[0]}
            options={sensorOptions}
            onChange={handleSelectedSensorChange} />
        </div>
        <InputOption
          className='name-input'
          showEditAndSave={false}
          value={alertParams.value}
          onChange={handleParamValueChange}
          title='Nome do alerta (opcional)' />
        <div className='input-option'>
          <div className='title'>Parâmetros disponíveis</div>
          <CustomSelect
            defaultValue={getSensorParamOptions()[0]}
            options={getSensorParamOptions()} />
        </div>
        <InputOption
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