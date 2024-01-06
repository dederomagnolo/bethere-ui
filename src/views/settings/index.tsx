import React, { useState } from 'react';
import _  from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'

import {
  AppCollapsible,
  Button,
  CustomSelect,
  EditIconWithTooltip,
  Checkbox
} from 'components';
import { getTimeOptions } from './functions';

import './styles.scss'
import { getUserDevices } from 'redux/device/selectors';
import { DeviceSelector } from 'components/device-selector';
import { InputOption } from './input-option';

import { getToken } from 'redux/user/selectors';
import { editSettingsAndSendCommand, fetchUserDevices } from 'services/fetch';
import { setUserDevices } from 'redux/device/actions';
import { editSettings } from 'services/settings';

type OptionType = {
  value: Number | String
}

export const Settings = () => {
  const dispatch = useDispatch()
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const timeOptions = getTimeOptions()
  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)

  // evolution: need to update here to get default settings selected by user
  const defaultDeviceSettings = _.get(defaultDevice, 'settings[0]', {
    automation: {
      startTime: '',
      endTime: '',
      interval: '',
      duration: '',
      intervalInHours: false,
    },
    wateringTimer: '',
    remoteMeasureInterval: ''
  })
  const {
    automation: {
      startTime,
      endTime,
      interval,
      duration,
      intervalInHours
    },
    wateringTimer,
    remoteMeasureInterval
  } = defaultDeviceSettings

  const initialState = {
    startTime,
    endTime,
    interval,
    duration,
    wateringTimer,
    remoteMeasureInterval,
    intervalInHours
  }

  const [settings, setSettings] = useState(initialState)
  const [editActivityPeriod, setEditActivityPeriod] = useState(false)

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement> & OptionType, name?: string) => {
    if (name) {
      const value = e.value
      return setSettings ({ ...settings, [name]: value })
    }

    const value = e.target.value
    setSettings({ ...settings, [e.target.name]: value })
  }

  const saveChanges = async () => {
    const { startTime, endTime, interval, duration } = settings

    const automation = {
      startTime, endTime, interval, duration
    }

    const deviceId = defaultDevice._id
    const settingsId = defaultDeviceSettings._id

    const res = await editSettingsAndSendCommand({
        token,
        settingsPayload: {
          settingsId, 
          deviceId,
          automation,
          ..._.omit(settings, 'startTime, endTime, interval, duration, intervalInHours')
        },
      }
    )

    dispatch(setUserDevices(res))
  }

  const saveIntervalInHours = async () => {
    const { startTime, endTime, interval, duration } = settings

    const automation = {
      startTime, endTime, interval, duration, intervalInHours: !intervalInHours
    }

    const deviceId = defaultDevice._id
    const settingsId = defaultDeviceSettings._id
    const res = await editSettingsAndSendCommand({
      token,
      settingsPayload: {
        settingsId,
        deviceId,
        automation,
        ..._.omit(settings, 'startTime, endTime, interval, duration, intervalInHours')
      }
    })

    const updatedDevices = await fetchUserDevices({
      token
    })

    dispatch(setUserDevices(updatedDevices))
  }

  const getCurrentTimeOption = (timeValue: number) => {
    return _.find(timeOptions, (option) => option.value === timeValue)
  }

  const AutoWateringConfig = (
    <div className='options options--auto-watering'>
      <div className='cycle-period'>
        <div className='cycle-period__time-select-container'>
          <span className='title'>Período de atividade</span> de
          <CustomSelect
            isDisabled={!editActivityPeriod}
            onChange={(option: any) => handleChangeSettings(option, 'startTime')}
            options={timeOptions}
            defaultValue={getCurrentTimeOption(settings.startTime)} />
        </div>
        <div className='cycle-period__time-select-container'>
          até
          <CustomSelect
            isDisabled={!editActivityPeriod}
            onChange={(option: any) => handleChangeSettings(option, 'endTime')}
            options={timeOptions}
            defaultValue={getCurrentTimeOption(settings.endTime)} />
        </div>
        <EditIconWithTooltip
          onSave={saveChanges}
          uniqueId='timeField'
          onToggle={() => setEditActivityPeriod(!editActivityPeriod)} />
      </div>
      <div className='description'>
        O período de atividade é o intervalo do dia em que a estação local irá fazer o ciclo de automação.
      </div>
      <div className='interval-option'>
        <InputOption
          onSave={saveChanges}
          name='interval'
          title={`Intervalo (${intervalInHours ? 'hrs' : 'min'})`}
          onChange={handleChangeSettings}
          value={settings.interval}
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
        onSave={saveChanges}
        name='duration'
        title='Tempo de irrigação (min)'
        onChange={handleChangeSettings}
        value={settings.duration}
      />
      <div className='description'>
        O tempo de irrigação corresponde ao tempo em que a irrigação permanece ligada quando é dado o tempo de intervalo.
      </div>
      {/* {ADICIONAR RESET DO TIMER DE AUTO} */}
    </div>
  )

  const ManualWateringConfig = (
    <div className='options options--single'>
      <InputOption
        onSave={saveChanges}
        title='Tempo de irrigação manual (min)'
        onChange={handleChangeSettings}
        value={settings.wateringTimer}
        name='wateringTimer'
      />
      <span className='description'>Tempo que a irrigação permanece ligada após o acionamento pelo botão.</span>
    </div>
  )

  const MeasuresConfig = (
    <div className='options options--single'>
      <InputOption
        onSave={saveChanges}
        title='Intervalo de envio (min)'
        onChange={handleChangeSettings}
        value={settings.remoteMeasureInterval}
        name='remoteMeasureInterval'
      />
      <div className='description'>
        Intervalo em que as medições serão salvas no histórico do dispositivo. Não afeta o recebimento em tempo real na tela de início.
      </div>
    </div>
  )

  const collapsibleOptions = [
    {
      title: 'Irrigação manual',
      component: ManualWateringConfig
    },
    {
      title: 'Irrigação automática',
      component: AutoWateringConfig
    },
    {
      title: 'Medições',
      component: MeasuresConfig
    }
  ]

  const renderCollapsibleOptions = _.map(collapsibleOptions, (option) => {
    const { title, component } = option
    return (
      <div className='collapsible-section' key={title}>
        <AppCollapsible title={title} innerComponent={component}/>
      </div>
    )
  })

  return (
    <div className='settings-view'>
      <div className='select-device__container'>
        <DeviceSelector allowNameEdition showDeviceInfo />
      </div>
      <h1>Configurações</h1>
      <div className='collapsible-options'>
        {renderCollapsibleOptions}
      </div>
      <div className='reset-section'>
        <div>
          <h2>Reiniciar estação local</h2>
          <p>
            A estação local pode demorar por volta de 10 segundos para reiniciar e estabilizar a conexão com a internet.
            Verifique a sua conexão com a internet antes de reiniciar.
          </p>
        </div>
        <div className='reset-section__button-container'>
          <Button variant='cancel'>Reiniciar</Button>
        </div>
      </div>
    </div>
  )
}