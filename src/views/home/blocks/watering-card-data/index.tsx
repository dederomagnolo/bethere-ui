import { useState, useEffect } from 'react'
import _ from 'lodash'
import moment from 'moment'
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
    lastCommandReceived: string,
    wateringStatus: any
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

  // first, static info from device received
  const deviceId = _.get(device, '_id')
  const deviceSettings = _.get(device, 'settings[0]')
  const automationSettings = _.get(deviceSettings, 'automation')
  const autoWateringModeEnabled = _.get(automationSettings, 'enabled')

  const [updatedWateringStatus, setUpdatedWateringStatus] = useState({
    manualRelayEnabled: false,
    autoRelayEnabled: false
  })

  const {
    defaultDeviceStatus,
    lastCommandReceived,
    wateringStatus = {}
} = deviceRealTimeData

const {
  elapsedTime,
  autoRelayEnabled,
  manualRelayEnabled
} = wateringStatus

const [wateringEnabled, setWateringEnabled] = useState(manualRelayEnabled)
const [autoModeEnabled, setAutoModeEnabled] = useState(autoWateringModeEnabled)

  useEffect(() => {
    setUpdatedWateringStatus(wateringStatus)
    setWateringEnabled(manualRelayEnabled)
  }, [elapsedTime, autoRelayEnabled, manualRelayEnabled])

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
    const {
      manualRelayEnabled,
      autoRelayEnabled
    } = updatedWateringStatus
  
    let operationLabel = 'Offline' 
    let pulsingCircleType = 'offline'

    if (connectionLoading) {
      return <LoadingIcon />
    }

    if (defaultDeviceStatus) {
      pulsingCircleType = 'online'
      operationLabel = 'Disponível'
      
      if (manualRelayEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Irrigação manual ligada'
      }

      if(autoRelayEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Irrigação automática ligada'
      }
    }


    return (
      <div className='option'>
        <PulsingCircle type={pulsingCircleType} />
        <span>{connectionLoading ? 'loading' : operationLabel}</span>
      </div>
    )
  }

  const renderNextCycleLabel = () => {
    if (!autoModeEnabled) return ''
    
    const isIntervalInHours = _.get(automationSettings, 'intervalInHours')
    const autoWateringInterval = _.get(automationSettings, 'interval')

    const factorToConvert = isIntervalInHours ?  60 * 60 * 1000 : 60 * 1000
    const momentTypeToConvert = isIntervalInHours ? 'hours' : 'minutes'
    const convertedElapsedTime = elapsedTime / factorToConvert
  
    const remainingTime = autoWateringInterval - convertedElapsedTime
  
    const next = moment().add(remainingTime, momentTypeToConvert)

    const autoOperationStartTime = _.get(automationSettings, 'startTime')
    const autoOperationEndTime = _.get(automationSettings, 'endTime')

    const startOfCurrentDay = moment().startOf('day')
    const startTime = moment(startOfCurrentDay).add(autoOperationStartTime, 'hours')
    const endTime = moment(startOfCurrentDay).add(autoOperationEndTime, 'hours')

    const currentTime = moment()
    const isCurrentTimeOnValidInterval = currentTime >= startTime && currentTime <= endTime

    const timeToStartOperation = moment.duration(startTime.diff(currentTime)).asMinutes()

    return `Próxima ligação: ${isCurrentTimeOnValidInterval ? next.format('HH:mm') : startTime.format('HH:mm')}`
  }
  
  return (
    <div className='watering-card'>
      {renderOperationLabel()}
      <div className='watering-card__options'>
        <div className='option option--toggle'>
          <span>Auto</span>
          <div>
            <Toggle
              disabled={connectionLoading || !defaultDeviceStatus}
              checked={autoModeEnabled}
              onChange={handleSendAutoCommand}
            />
          </div>
        </div>
        <span className='option__status-label'>
          {connectionLoading || !defaultDeviceStatus ? null : renderNextCycleLabel()}
        </span>
        <div className='option option--toggle'>
            <span>Manual</span>
            <Toggle
              disabled={connectionLoading || !defaultDeviceStatus}
              checked={wateringEnabled}
              onChange={handleSendCommand}
            />
        </div>
        {wateringEnabled ? <span className='option__status-label'>Tempo restante:</span> : null}
      </div>
    </div>
  )
}