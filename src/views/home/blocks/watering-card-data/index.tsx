import { useState, useEffect } from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'

import { COMMANDS, WsReadyState } from 'global/consts'
import callApi from 'services/callApi'

import { getToken, getUserId } from 'redux/user/selectors'
import { Toggle } from 'components/ui-atoms/switch'

import { PulsingCircle } from 'components/ui-atoms/pulsing-circle'

import './styles.scss'


interface WateringCardDataProps {
  wsStatus: number
  device: any
  deviceRealTimeData: {
    defaultDeviceStatus: boolean
    measures: any
    lastCommandReceived: string
  }
}

export const WateringCardData = ({
  wsStatus,
  device,
  deviceRealTimeData
} : WateringCardDataProps) => {
  const token = useSelector(getToken)
  const userId = useSelector(getUserId)

  const {
    defaultDeviceStatus,
    lastCommandReceived
  } = deviceRealTimeData
  const isRealTimeWateringStateEnabled = lastCommandReceived === COMMANDS.MANUAL_WATERING.OPTIONS.ON
  const deviceSettings = _.get(device, 'settings[0]')
  const autoWateringEnabled = _.get(deviceSettings, 'automation.enabled')

  const [wateringEnabled, setWateringEnabled] = useState(isRealTimeWateringStateEnabled)
  const [autoModeEnabled, setAutoModeEnabled] = useState(autoWateringEnabled)

  const deviceId = _.get(device, '_id')

  useEffect(() => {
    console.log('mount')
  }, [])

  useEffect(() => {
    setWateringEnabled(isRealTimeWateringStateEnabled)
  }, [isRealTimeWateringStateEnabled])

  const handleSendCommand = async () => {
    if(wsStatus === WsReadyState.OPEN && defaultDeviceStatus) {
      const { ON, OFF } = COMMANDS.MANUAL_WATERING.OPTIONS
      const shouldEnableWatering = !wateringEnabled && lastCommandReceived !== ON
      const commandToSend = shouldEnableWatering ? ON : OFF

      const commandPayload = {
        categoryName: COMMANDS.MANUAL_WATERING.CATEGORY_NAME,
        commandName: commandToSend,
        changedFrom: "App",
        userId,
        deviceId
      }
    
      const res = await callApi({
        token,
        method: 'POST',
        service: '/local-station/command',
        payload: commandPayload,
      })

      if (res) {
        setWateringEnabled(!wateringEnabled)
      }
    }
  }

  const renderOperationLabel = () => {
    let operationLabel = 'Offline' 
    let pulsingCircleType = 'offline'

    if(defaultDeviceStatus) {
      if(wateringEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Irrigação manual ligada'
      } else {
        pulsingCircleType = 'online'
        operationLabel = 'Disponível'
      }
    }


    return (
      <div className='option'>
        <PulsingCircle type={pulsingCircleType} />
        <span>{operationLabel}</span>
      </div>
    )
  }

  return (
    <div className='watering-card'>
      {renderOperationLabel()}
      
      <div className='option option--toggle'>
        <Toggle
          disabled={!defaultDeviceStatus}
          checked={autoModeEnabled}
          onChange={() => {}}
        />
        <span>Auto</span>
      </div>
      <div className='option option--toggle'>
        <Toggle
          disabled={!defaultDeviceStatus}
          checked={wateringEnabled}
          onChange={handleSendCommand}
        />
        <span>Manual</span>
      </div>
    </div>
  )
}