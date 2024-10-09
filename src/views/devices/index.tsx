import { Button, EditIconWithTooltip, Toggle } from 'components'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { getUserDevices } from 'redux/device/selectors'
import { Device } from 'types/interfaces'

import './styles.scss'
import { View } from 'components/app-view'
import { useState } from 'react'
import callApi from 'services/callApi'
import axios from 'axios'

export const DevicesView = () => {
  const userDevices = useSelector(getUserDevices)
  const [deviceToEdit, setDeviceToEdit] = useState({} as Device)
  const [configStep, setConfigStep] = useState(0)

  const devicesList = (
    <div className='devices-list'>
      {_.map(userDevices, (device: Device, index) => {
        return (
          <div className='device-container' key={device._id}>
            <div className='device-container__title-container'>
              <div>{device.deviceName || `Dipositivo ${index + 1}`}</div>
              <EditIconWithTooltip
                onEdit={() => setDeviceToEdit(device)}
                uniqueId='device-view-card-edit'
                shouldToggleToShowSave={false}
              />
            </div>
            <div className='device-container__infos'>
              <div>{`Código Serial: ${device.deviceSerialKey}`}</div>
              <div>{`Quantidade de saídas: ${device.actuators.length}`}</div>
              <div className='device-container__sensors'>
                <div>Sensores:</div>
                <div className='device-container__sensor-list'>
                {_.map(device.sensors, (sensor) => {
                  return (
                    <div
                      key={sensor._id}
                      className='device-container__sensor-info'>
                      <div className='device-container__sensor-name'>
                        {sensor.name || sensor.serialKey}
                      </div>
                      <Toggle
                        disabled={true}
                        onChange={() => null}
                        checked={sensor.enabled} />
                    </div>
                  )
                })}
                </div>
              </div>
            </div>
          </div> 
        )
      })}
    </div>
  )

  const checkDeviceConnectionAndAdvance = async () => {
    const params = {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'http://localhost:3000'
      }
    }

    try {
      const res = 
        await fetch('http://192.168.1.12', params)

      if (res.status === 200) {
        return setConfigStep(1)
      }
    
      // adicionar error handling aqui
    } catch (err) {
      console.log(err)
    }
  }

  const sendWiFiCredentialsToDevice = async () => {
    const params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'http://localhost:3000'
      },
      body: ''
    }

    try {
      const res = 
        await fetch('http://192.168.1.12', params)

      if (res.status === 200) {
        return setConfigStep(1)
      }
    
      // adicionar error handling aqui
    } catch (err) {
      console.log(err)
    }
  }

  const configureNetwork = (
    <div className='stepper__step'>
      <div>{deviceToEdit.deviceName}</div>
      <h3>Instruções para configuração de rede</h3>
      <div>1 - Para configurar a rede wifi do seu dispositivo, pressione o botão de configuração e aguarde 4 segundos, a luz vermelha de configuração deve estar acesa.</div>
      <div>2 - Verifique suas conexões Wi-Fi e conecte-se à rede BETHERE com a senha welcome123.</div>
      
      <div className='stepper__actions'>
        <Button variant='cancel' onClick={() => setDeviceToEdit({} as Device)}>Cancelar</Button>
        <Button onClick={checkDeviceConnectionAndAdvance}>
          Avançar
        </Button>
      </div>
    </div>
  )

  const setWiFiNetWork = (
    <div>

    </div>
  )

  const renderStepper = () => {
    switch(configStep) {
      case 1:
        return setWiFiNetWork
      default:
        return configureNetwork
    }
  }

  return (
    <View title='Dispositivos' className='devices-view'>
      {_.isEmpty(deviceToEdit) ? devicesList : renderStepper()}
    </View>
  )
}