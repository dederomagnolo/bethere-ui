import { useState, useEffect } from 'react'
import Switch from 'react-switch'
import _ from 'lodash'

import { useSelector } from 'react-redux'

import { COMMANDS, WsReadyState } from '../../../global/consts'
import callApi from '../../../services/callApi'

import { getToken, getUserId } from '../../../redux/user/selectors'

interface SwitchProps {
  checked: boolean
  onChange: Function,
  disabled?: boolean
}

interface WateringCardDataProps {
  wsStatus: number
  device: any
  deviceRealTimeData: {
    defaultDeviceStatus: boolean
    measures: any
    lastCommandReceived: string
  }
}

const CustomSwitch = ({
  onChange,
  checked,
  disabled
}: SwitchProps) => {
  return (
    <Switch
      disabled={disabled}
      boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      checked={checked}
      onChange={() => onChange && onChange()}
    />
  )
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
    setWateringEnabled(isRealTimeWateringStateEnabled)
  }, [lastCommandReceived])

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

  const checkWateringOperationStatus = () => {
    if(defaultDeviceStatus) {
      return `Irrigação manual ${wateringEnabled ? 'ligada' : 'desligada'}`
    }
    return 'Offline'
  }

  return (
    <div className='watering-card'>
      <div className='option'>
        <span>Status: </span>
        <span>{checkWateringOperationStatus()}</span>
      </div>
      <div className='option option--toggle'>
        <CustomSwitch
          disabled={!defaultDeviceStatus}
          checked={autoModeEnabled}
          onChange={() => {}}
        />
        <span>Auto</span>
      </div>
      <div className='option option--toggle'>
        <CustomSwitch
          disabled={!defaultDeviceStatus}
          checked={wateringEnabled}
          onChange={handleSendCommand}
        />
        <span>Manual</span>
      </div>
    </div>
  )
}