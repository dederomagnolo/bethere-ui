import React, { useState } from 'react';
import Select from  'react-select'
import _ from 'lodash'

import { Input } from '../../components/input';
import { getTimeOptions } from './functions';
import { AppCollapsible } from '../../components/collapsible'

import './styles.scss'

const CustomSelect = ({ options }: any) => {
  return (
    <Select
    menuPortalTarget={document.querySelector('body')}
      defaultMenuIsOpen
      className='react-select-container'
      classNamePrefix='react-select'
      options={options} />
  )
}

export const Settings = () => {
  const timeOptions = getTimeOptions()

  const [settings, setSettings] = useState({
    startTime: '',
    endTime: '',
    interval: '',
    duration: '',
    pumpTimer: '',
    remoteMeasureInterval: ''
  })

  const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSettings({...settings, [e.target.name]: value})
  }

  const AutoWateringConfig = () => {
    return (
      <div className='options options--auto-watering'>
        <span>Período de atividade</span>
        <div className='cycle-period'>
          <div className='cycle-period__time-select-container'>
            De
            <CustomSelect options={timeOptions} />
          </div>
          <div className='cycle-period__time-select-container'>
            até
            <CustomSelect options={timeOptions} />
          </div>
        </div>
        <div className='input-option'>
          Intervalo
          <Input
            name='interval'
            onChange={handleChangeSettings}
            value={settings.interval} />
        </div>
        <div className='input-option'>
          Tempo de irrigação
          <Input
            name='duration'
            onChange={handleChangeSettings}
            value={settings.duration} />
        </div>
      </div>
    )
  }

  const ManualWateringConfig = () => {
    return (
      <div className='options options--manual-watering'>
        <div>
          <span className='title'>Timer da irrigação manual</span>
          <Input value={settings.pumpTimer} name='pumpTimer' onChange={handleChangeSettings} />
        </div>
        <span className='description'>Tempo que a irrigação permanece ligada após o acionamento pelo botão.</span>
      </div>
    )
  }

  const MeasuresConfig = () => {
    return (
      <div className='input-option'>
          Intervalo de envio
          <Input
            name='remoteMeasureInterval'
            onChange={() => {}}
            value={settings.remoteMeasureInterval} />
        </div>
    )
  }

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

  const renderCollapsibleOptions = () => _.map(collapsibleOptions, (option) => {
    const { title, component } = option
    return (
      <div className='collapsible-section' key={title}>
        <AppCollapsible title={title} InnerComponent={component}/>
      </div>
    )
  })

  return(
    <div className='settings-view'>
      <div className='select-device__container'>
        <h1>Dispositivo</h1>
        <CustomSelect />
      </div>
      <h1>Configurações</h1>
      <div className='collapsible-options'>
        {renderCollapsibleOptions()}
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
          <button>Reiniciar</button>
        </div>
      </div>
    </div>
  )
}