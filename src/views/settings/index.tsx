import React, { useState } from 'react';
import _  from 'lodash'
import { useDispatch, useSelector } from 'react-redux';


import { AppCollapsible, Button, CustomSelect} from 'components';
import { getTimeOptions } from './functions';

import './styles.scss'
import { getUserDevices } from 'redux/device/selectors';
import { DeviceSelector } from 'components/device-selector';
import { InputOption } from './input-option';

import { editSettings } from 'services/settings';
import { getToken } from 'redux/user/selectors';
import { sendCommandToServer } from 'services/commands';
import { editSettingsAndSendCommand, fetchUserDevices } from 'services/fetch';
import { setUserDevices } from 'redux/device/actions';

export const Settings = () => {
  const dispatch = useDispatch()
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const timeOptions = getTimeOptions()
  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const settingsInitialState = {
    startTime: '',
    endTime: '',
    interval: '',
    duration: '',
    wateringTimer: '',
    remoteMeasureInterval: ''
  }

  // evolution: need to update here to get default settings selected by user
  const defaultDeviceSettings = _.get(defaultDevice, 'settings[0]', settingsInitialState)

  const {
    automation: {
      startTime,
      endTime,
      interval,
      duration,
    },
    wateringTimer,
    remoteMeasureInterval
  } = defaultDeviceSettings

  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    startTime,
    endTime,
    interval,
    duration,
    wateringTimer,
    remoteMeasureInterval
  })

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          ..._.omit(settings, 'startTime, endTime, interval, duration')
        },
        loadingCallback: setLoading,
      }
    )

    dispatch(setUserDevices(res))
  }

  const AutoWateringConfig = (
    <div className='options options--auto-watering'>
      <div className='cycle-period'>
        <div className='cycle-period__time-select-container'>
          <span className='title'>Período de atividade</span> de
          <CustomSelect options={timeOptions} />
        </div>
        <div className='cycle-period__time-select-container'>
          até
          <CustomSelect options={timeOptions} />
        </div>
      </div>
      <div className='description'>
        O período de atividade é o intervalo do dia em que a estação local irá fazer o ciclo de automação.
      </div>
      <InputOption
        onSave={saveChanges}
        name='interval'
        title='Intervalo'
        onChange={handleChangeSettings}
        value={settings.interval}
      />
      <div className='description'>O intervalo é o tempo entre um ciclo de irrigação e outro.</div>
      <InputOption
        onSave={saveChanges}
        name='duration'
        title='Tempo de irrigação'
        onChange={handleChangeSettings}
        value={settings.duration}
      />
      <div className='description'>
        O tempo de irrigação corresponde ao tempo em que a irrigação permanece ligada quando é dado o tempo de intervalo.
      </div>
    </div>
  )

  const ManualWateringConfig = (
    <div className='options options--manual-watering'>
      <InputOption
        onSave={saveChanges}
        title='Timer da irrigação manual'
        onChange={handleChangeSettings}
        value={settings.wateringTimer}
        name='wateringTimer'
      />
      <span className='description'>Tempo que a irrigação permanece ligada após o acionamento pelo botão.</span>
    </div>
  )

  const MeasuresConfig = (
    <InputOption
      onSave={saveChanges}
      title='Intervalo de envio'
      onChange={handleChangeSettings}
      value={settings.remoteMeasureInterval}
      name='remoteMeasureInterval'
    />
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

  return(
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