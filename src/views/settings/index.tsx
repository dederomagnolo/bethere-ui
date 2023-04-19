import React, { useState } from 'react';
import _  from 'lodash'
import { useSelector } from 'react-redux';


import { Input, AppCollapsible, Button, CustomSelect} from 'components';
import { getTimeOptions } from './functions';

import './styles.scss'
import { getUserDevices } from 'redux/device/selectors';
import { DeviceSelector } from 'components/device-selector';

export const Settings = () => {
  const userDevices = useSelector(getUserDevices)

  const timeOptions = getTimeOptions()
  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)
  const settingsInitialState = {
    startTime: '',
    endTime: '',
    interval: '',
    duration: '',
    pumpTimer: '',
    remoteMeasureInterval: ''
  }

  // evolution: need to update here to get default settings selected by user
  const defaultDeviceSettings = _.get(defaultDevice, 'settings[0]', settingsInitialState)

  const {
    wateringRoutine: {
      startTime,
      endTime,
      interval,
      duration,
    },
    pumpTimer,
    remoteMeasureInterval
  } = defaultDeviceSettings

  const [settings, setSettings] = useState({
    startTime,
    endTime,
    interval,
    duration,
    pumpTimer,
    remoteMeasureInterval
  })
  const [deviceNameEdition, setDeviceNameEdition] = useState(false)
  const [editedDeviceName, setEditedDeviceName] = useState(defaultDevice.deviceName)

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSettings({ ...settings, [e.target.name]: value })
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
      <div className='input-option'>
        <span className='title'>Intervalo</span>
        <Input
          name='interval'
          onChange={handleChangeSettings}
          value={settings.interval} />
      </div>
      <div className='description'>O intervalo é o tempo entre um ciclo de irrigação e outro.</div>
      <div className='input-option'>
        <span className='title'>Tempo de irrigação</span>
        <Input
          name='duration'
          onChange={handleChangeSettings}
          value={settings.duration} />
      </div>
      <div className='description'>
        O tempo de irrigação corresponde ao tempo em que a irrigação permanece ligada quando é dado o tempo de intervalo.
      </div>
    </div>
  )

  const ManualWateringConfig = (
    <div className='options options--manual-watering'>
      <div className='input-option'>
        <span className='title'>Timer da irrigação manual</span>
        <Input value={settings.pumpTimer} name='pumpTimer' onChange={handleChangeSettings} />
      </div>
      <span className='description'>Tempo que a irrigação permanece ligada após o acionamento pelo botão.</span>
    </div>
  )

  const MeasuresConfig = (
    <div className='input-option'>
      <span className='title'>Intervalo de envio</span>
      <Input
        name='remoteMeasureInterval'
        onChange={handleChangeSettings}
        value={settings.remoteMeasureInterval} />
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

  return(
    <div className='settings-view'>
      <div className='select-device__container'>
        <DeviceSelector allowNameEdition />
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