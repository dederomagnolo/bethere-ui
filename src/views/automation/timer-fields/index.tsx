import _ from 'lodash'
import { useState } from 'react'

import {
  Checkbox,
  CustomSelect,
  Input
} from 'components'

import './styles.scss'

type OptionType = {
  value: Number | String
}

const getTimeOptions = () => {
  const timeOptions = [] as any;

  for (let i = 0; i < 24; i++) {
    timeOptions.push({
      value: i,
      label: `${i}h`,
    });
  }

  return timeOptions
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

export const TimerFields = ({
  timerSettings = {},
  setTimerFields
}: any) => {
  const [editEndTime, setEditEndTime] = useState(false)

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement> & OptionType, name?: string) => {
    if (name) {
      const value = e.value
      return setTimerFields ({ ...timerSettings, [name]: value })
    }

    const value = e.target.value
    setTimerFields({ ...timerSettings, [e.target.name]: value })
  }

  const handleChangeIntervalInOurs = (e: any) => {
    const checked = e.target.checked

    const currentInterval = timerSettings.interval
    const normalizedIntervalToHours = checked ? minutesToHours(currentInterval) : currentInterval

    const updatedEditedSettings = { ...timerSettings, intervalInHours: checked, interval: normalizedIntervalToHours }
    setTimerFields(updatedEditedSettings)
  }

  const handleChangeContinuous = (e: any) => {
    const checked = e.target.checked

    setTimerFields({ ...timerSettings, continuous: checked})
  }

  const setEndTimeOptionsBasedOnStartTime = () => {
    const editedStartTime = timerSettings.startTime
    return _.filter(timeOptions, (option) => option.value > editedStartTime)
  }

  return (
    <div className='timer-fields'>
      <div className='field'>
        <div className='field__title'>Período de atividade</div>
        <div className='field__content'>
          <div className='time-select-container'>
            Início: 
            <CustomSelect
              isDisabled={timerSettings.continuous}
              onChange={(option: any) => {
                setEditEndTime(true)
                handleChangeSettings(option, 'startTime')
              }}
              value={getCurrentTimeOption(timerSettings.startTime)}
              options={timeOptions}
              defaultValue={getCurrentTimeOption(timerSettings.startTime)} />
          </div>
          <div className='time-select-container'>
            Fim: 
            <CustomSelect
              isDisabled={!editEndTime || timerSettings.continuous}
              onChange={(option: any) => handleChangeSettings(option, 'endTime')}
              options={setEndTimeOptionsBasedOnStartTime()}
              value={getCurrentTimeOption(timerSettings.endTime)}
              defaultValue={getCurrentTimeOption(timerSettings.endTime)} />
          </div>
          <Checkbox
            checked={timerSettings.continuous}
            className='field__checkbox'
            label='Modo contínuo: Operar 24h'
            onChange={handleChangeContinuous}
          />
        </div>
        <div className='field__description'>
          O período de atividade é o intervalo do dia em que a estação local irá fazer o ciclo de automação.
        </div>
      </div>
      <div className='field'>
        <div className='field__content'>
          <div className='field__title'>
            {`Intervalo (${timerSettings.intervalInHours ? 'hrs' : 'min'})`}
          </div>
          <Input
            className='field__time-input'
            name='interval'
            onChange={handleChangeSettings}
            value={
              timerSettings.intervalInHours 
                ? minutesToHours(timerSettings.interval) 
                : timerSettings.interval}
          />
          <Checkbox
            checked={timerSettings.intervalInHours}
            className='field__checkbox'
            label='Utilizar intervalo de  tempo em horas'
            onChange={handleChangeIntervalInOurs}
          />
        </div>
        <div className='field__description'>
          O intervalo é o tempo entre um ciclo de irrigação e outro.
        </div>
      </div>
      
      <div className='field'>
        <div className='field__content'>
          <div className='field__title'>Tempo de irrigação (min)</div>
          <Input
            className='field__time-input'
            name='duration'
            onChange={handleChangeSettings}
            value={timerSettings.duration}
          />
        </div>
        <div className='field__description'>
          O tempo de irrigação corresponde ao tempo em que a irrigação permanece ligada quando é dado o tempo de intervalo.
        </div>
      </div>
    </div>
  )
}