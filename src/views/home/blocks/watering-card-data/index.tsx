import { useState, useEffect } from 'react'
import _ from 'lodash'
import { useSelector,  useDispatch } from 'react-redux'

import { COMMANDS, WsReadyState } from 'global/consts'
import callApi from 'services/callApi'

import { getToken, getUserId } from 'redux/user/selectors'
import { Toggle } from 'components/ui-atoms/switch'

import { PulsingCircle } from 'components/ui-atoms/pulsing-circle'

import './styles.scss'
import { LoadingIcon } from '../loading-icon'
import { editSettingsAndSendCommand } from 'services/fetch'
import { setUserDevices } from 'redux/device/actions'


interface WateringCardDataProps {
  wsStatus: number
  device: any
  deviceRealTimeData: {
    defaultDeviceStatus: boolean
    measures: any
    lastCommandReceived: string
  }
  connectionLoading: boolean
}

export const WateringCardData = ({
  wsStatus,
  device,
  deviceRealTimeData,
  connectionLoading
} : WateringCardDataProps) => {
  const token = useSelector(getToken)
  const userId = useSelector(getUserId)
  const dispatch = useDispatch()

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

  const handleSendAutoCommand = async () => {
    const settingsId = deviceSettings._id
    const res = await editSettingsAndSendCommand({
        token,
        settingsPayload: {
          settingsId, 
          deviceId,
          automation: {
            enabled: !autoModeEnabled
          }
        },
      }
    )

    if (res) {
      dispatch(setUserDevices(res))
      setAutoModeEnabled(!autoModeEnabled)
    }
  }

  const renderOperationLabel = () => {
    let operationLabel = 'Offline' 
    let pulsingCircleType = 'offline'

    if (connectionLoading) {
      return <LoadingIcon />
    }

    if (defaultDeviceStatus) {
      pulsingCircleType = 'online'
      operationLabel = 'Disponível'
      
      if (wateringEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Irrigação manual ligada'
      }
    }


    return (
      <div className='option'>
        <PulsingCircle type={pulsingCircleType} />
        <span>{connectionLoading ? 'loading' : operationLabel}</span>
      </div>
    )
  }

  return (
    <div className='watering-card'>
      {renderOperationLabel()}
      <div className='watering-card__options'>
        <div className='option option--toggle'>
          <span>Auto</span>
          <div>
            <Toggle
              disabled={connectionLoading}
              checked={autoModeEnabled}
              onChange={handleSendAutoCommand}
            />
          </div>
        </div>
        <span className='option__status-label'>Próxima ligação:</span>
        <div className='option option--toggle'>
            <span>Manual</span>
            <Toggle
              disabled={connectionLoading}
              checked={wateringEnabled}
              onChange={handleSendCommand}
            />
        </div>
        {wateringEnabled ? <span className='option__status-label'>Tempo restante:</span> : null}
      </div>
    </div>
  )
}