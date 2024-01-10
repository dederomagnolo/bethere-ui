import _ from 'lodash'
import { useState } from 'react'
import { getTimeOptions } from '../../functions';

import {
  AppCollapsible,
  Button,
  CustomSelect,
  EditIconWithTooltip,
  Checkbox,
  Toggle
} from 'components';
import { InputOption } from 'views/settings/input-option';

type OptionType = {
  value: Number | String
}

const timeOptions = getTimeOptions()

const getCurrentTimeOption = (timeValue: number) => {
  return _.find(timeOptions, (option) => option.value === timeValue)
}

export const AutoWateringConfig = ({
  automationSettings = {},
  saveChanges,
  deviceId
}: any) => {
  const [editActivityPeriod, setEditActivityPeriod] = useState(false)

  const {
    startTime,
    endTime,
    interval,
    duration,
    intervalInHours
  } = automationSettings

  const [editedAutomationSettings, setEditedAutomationSettings] = useState({
    startTime,
    endTime,
    interval,
    duration,
    intervalInHours
  })

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement> & OptionType, name?: string) => {
    if (name) {
      const value = e.value
      return setEditedAutomationSettings ({ ...automationSettings, [name]: value })
    }

    const value = e.target.value
    setEditedAutomationSettings({ ...automationSettings, [e.target.name]: value })
  }

  const saveAutomationChanges = () => {
    console.log({
      editedAutomationSettings
    })
    return saveChanges({ automation: editedAutomationSettings })
  }

  // const saveIntervalInHours = async () => {
  //   const { startTime, endTime, interval, duration } = settings

  //   const automation = {
  //     startTime, endTime, interval, duration, intervalInHours: !intervalInHours
  //   }

  //   const deviceId = defaultDevice._id
  //   const settingsId = defaultDeviceSettings._id
  //   const res = await editSettingsAndSendCommand({
  //     token,
  //     settingsPayload: {
  //       settingsId,
  //       deviceId,
  //       automation,
  //       ..._.omit(settings, 'startTime, endTime, interval, duration, intervalInHours')
  //     }
  //   })

  //   const updatedDevices = await fetchUserDevices({
  //     token
  //   })

  //   dispatch(setUserDevices(updatedDevices))
  // }


  return (
    <div className='options options--auto-watering'>
      <div className='cycle-period'>
        <div className='cycle-period__time-select-container'>
          <span className='title'>Período de atividade</span> de
          <CustomSelect
            isDisabled={!editActivityPeriod}
            onChange={(option: any) => handleChangeSettings(option, 'startTime')}
            options={timeOptions}
            defaultValue={getCurrentTimeOption(editedAutomationSettings.startTime)} />
        </div>
        <div className='cycle-period__time-select-container'>
          até
          <CustomSelect
            isDisabled={!editActivityPeriod}
            onChange={(option: any) => handleChangeSettings(option, 'endTime')}
            options={timeOptions}
            defaultValue={getCurrentTimeOption(editedAutomationSettings.endTime)} />
        </div>
        <EditIconWithTooltip
          onSave={saveAutomationChanges}
          uniqueId='timeField'
          onToggle={() => setEditActivityPeriod(!editActivityPeriod)} />
      </div>
      <div className='description'>
        O período de atividade é o intervalo do dia em que a estação local irá fazer o ciclo de automação.
      </div>
      <div className='interval-option'>
        <InputOption
          onSave={saveAutomationChanges}
          name='interval'
          title={`Intervalo (${intervalInHours ? 'hrs' : 'min'})`}
          onChange={handleChangeSettings}
          value={editedAutomationSettings.interval}
        />
        {/* <Checkbox
          inititalState={intervalInHours}
          className='interval-option__checkbox'
          label='Utilizar intervalo de  tempo em horas'
          onChange={saveIntervalInHours}
        /> */}
      </div>
      <div className='description'>O intervalo é o tempo entre um ciclo de irrigação e outro.</div>
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
  )
}