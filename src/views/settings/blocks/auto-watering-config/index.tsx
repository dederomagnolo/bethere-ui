import _ from 'lodash'
import { useEffect, useState } from 'react'
import { getSensorParamsSelectOptions, getTimeOptions, sensorSelectOptions } from '../../functions'

import {
  Checkbox,
  CustomSelect,
  EditIconWithTooltip,
  Toggle
} from 'components'
import { InputOption } from 'views/settings/input-option'

type OptionType = {
  value: Number | String
}

type SelectOptions = {
  label: string
  value: any
}

const timeOptions = getTimeOptions()

const getCurrentTimeOption = (timeValue: number) => {
  return _.find(timeOptions, (option) => option.value === timeValue)
}

const minutesToHours = (valueInMinutes: number) => {
  const hours = valueInMinutes / 60
  return hours < 1 ? 1 : hours
}

const hoursToMinutes = (valueInHours: number) => {
  return valueInHours * 60
}

export const AutoWateringConfig = ({
  automationSettings = {},
  saveChanges,
  sensors
}: any) => {
  const [editStartTime, setEditStartTime] = useState(false)
  const [editEndTime, setEditEndTime] = useState(false)

  const [editAutomationInterval, setAutomationIntervalEdition] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState(sensors[0])
  const [paramOptions, setSensorParamOptions] = useState(
    getSensorParamsSelectOptions(selectedSensor.model)
  )

  const {
    startTime,
    endTime,
    interval,
    duration,
    intervalInHours,
    continuous
  } = automationSettings

  const [editedAutomationSettings, setEditedAutomationSettings] = useState({
    startTime,
    endTime,
    interval,
    duration,
    intervalInHours,
    continuous
  })
  const [triggerParams, setTriggerParams] = useState({
    operator: 0
  })

  useEffect(() => {
    const updatedParamOptions = getSensorParamsSelectOptions(selectedSensor.model)
    setSensorParamOptions(updatedParamOptions)
  }, [selectedSensor])

  const sensorOptions = sensorSelectOptions(sensors)

  const handleSelectedSensorChange = ({ value: selectedSensorId }: SelectOptions) => {
    const sensorById = _.find(sensors, (sensor) => sensor._id === selectedSensorId)
    setSelectedSensor(sensorById)
  }

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement> & OptionType, name?: string) => {
    if (name) {
      const value = e.value
      return setEditedAutomationSettings ({ ...editedAutomationSettings, [name]: value })
    }

    const value = e.target.value
    setEditedAutomationSettings({ ...editedAutomationSettings, [e.target.name]: value })
  }

  const saveAutomationChanges = () => {
    return saveChanges({ automation: editedAutomationSettings })
  }

  const handleChangeIntervalInOurs = (e: any) => {
    const checked = e.target.checked

    const currentInterval = editedAutomationSettings.interval
    const normalizedIntervalToHours = checked ? minutesToHours(currentInterval) : currentInterval

    const updatedEditedSettings = { ...editedAutomationSettings, intervalInHours: checked, interval: normalizedIntervalToHours }
    setEditedAutomationSettings(updatedEditedSettings)
  }

  const handleChangeContinuous = (e: any) => {
    const checked = e.target.checked

    setEditedAutomationSettings({ ...editedAutomationSettings, continuous: checked})
  }

  const setEndTimeOptionsBasedOnStartTime = () => {
    const editedStartTime = editedAutomationSettings.startTime
    const possibleTimeOptions =_.filter(timeOptions, (option) => option.value > editedStartTime)

    return possibleTimeOptions
  }

  return (
    <div className='options options--auto-watering'>
      <div className='cycle-period'>
        <span className='title'>Período de atividade</span>
        <div className='cycle-period__content'>
          <div className='cycle-period__time-select-container'>
            de
            <CustomSelect
              isDisabled={!editStartTime || editedAutomationSettings.continuous}
              onChange={(option: any) => {
                setEditEndTime(true)
                handleChangeSettings(option, 'startTime')
              }}
              value={getCurrentTimeOption(editedAutomationSettings.startTime)}
              options={timeOptions}
              defaultValue={getCurrentTimeOption(editedAutomationSettings.startTime)} />
          </div>
          <div className='cycle-period__time-select-container'>
            até
            <CustomSelect
              isDisabled={!editEndTime || editedAutomationSettings.continuous}
              onChange={(option: any) => handleChangeSettings(option, 'endTime')}
              options={setEndTimeOptionsBasedOnStartTime()}
              value={getCurrentTimeOption(editedAutomationSettings.endTime)}
              defaultValue={getCurrentTimeOption(editedAutomationSettings.endTime)} />
          </div>
        </div>
        <div className='description'>
          O período de atividade é o intervalo do dia em que a estação local irá fazer o ciclo de automação.
        </div>
        <div className='interval-option'>
          <InputOption
            initialValue={interval}
            onEdit={() => setAutomationIntervalEdition(true)}
            onSave={() => {
              saveAutomationChanges()
              setAutomationIntervalEdition(false)
            }}
            onCancel={() => setEditedAutomationSettings({ ...editedAutomationSettings, interval, intervalInHours })}
            name='interval'
            title={`Intervalo (${editedAutomationSettings.intervalInHours ? 'hrs' : 'min'})`}
            onChange={handleChangeSettings}
            value={
              editedAutomationSettings.intervalInHours 
                ? minutesToHours(editedAutomationSettings.interval) 
                : editedAutomationSettings.interval}
          />
        </div>
      </div>
      <Checkbox
        disabled={!editStartTime}
        checked={editedAutomationSettings.continuous}
        className='interval-option__checkbox'
        label='Modo contínuo: Operar 24h'
        onChange={handleChangeContinuous}
      />
      <div className='description'>
        O período de atividade é o intervalo do dia em que a estação local irá fazer o ciclo de automação.
      </div>
      <div className='interval-option'>
        <InputOption
          onSave={saveAutomationChanges}
          name='duration'
          title='Tempo de irrigação (min)'
          onChange={handleChangeSettings}
          value={editedAutomationSettings.duration}
        />
        <div className='description'>
          O tempo de irrigação corresponde ao tempo em que a irrigação permanece ligada quando é dado o tempo de intervalo.
        </div>
      </div>
      <div className='switch-option'>
        Acionamento por sensor
        <Toggle checked={true} onChange={() => {}} />
      </div>
      <div className='options options--auto-watering trigger'>
        <div className='title'>Sensor</div>
        <CustomSelect
          name='selectedSensor'
          options={sensorOptions}
          onChange={handleSelectedSensorChange} />
        <div className='title'>Parâmetros disponíveis</div>
        <CustomSelect
          name='paramType'
          onChange={() => {}}
          options={paramOptions} />
        <div className='trigger-options'>
          <div className='title'>Limite de acionamento:</div>
          <div className='trigger-options__operators'>
            <Checkbox
              radio
              name='less-than'
              checked={triggerParams.operator === 0}
              initialState={triggerParams.operator === 0}
              label='Menor que'
              onChange={() => setTriggerParams({...triggerParams, operator: 0})} />
            <Checkbox
              radio
              checked={triggerParams.operator === 1}
              name='greater-than'
              initialState={triggerParams.operator === 1}
              label='Maior que'
              onChange={() => setTriggerParams({...triggerParams, operator: 1})} />
          </div>
          <InputOption onChange={() => {}} />

        </div>
      </div>
    </div>
  )
}