import { useState, useEffect } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { useSelector,  useDispatch } from 'react-redux'

import { Toggle, Loading } from 'components'
import { PulsingCircle } from 'components/ui-atoms/pulsing-circle'

import { NEW_COMMANDS, WsReadyState } from 'global/consts'

import callApi from 'services/callApi'
import { editSettingsAndSendCommand } from 'services/fetch'

import { getToken, getUserId } from 'redux/user/selectors'
import { setUserDevices } from 'redux/device/actions'

import './styles.scss'
import {
  FaLeaf as Leaf,
} from 'react-icons/fa'

interface CardLabelProps {
  label: string
  Icon?: any
}

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
  isDeviceConnected: boolean
}

const renderIcon = (BaseIcon: any) => <BaseIcon className='card-label-icon' size={20} />

const CardLabel = ({ label, Icon } : CardLabelProps) => {
  const icon = Icon && (
    <div className='icon-container'>
      {renderIcon(Icon)}
    </div>
  )

  return (
    <div className='card-label'>
      {icon}
      <span>{label}</span>
    </div>
  )
}

export const WateringCardData = ({
  wsStatus,
  device,
  deviceRealTimeData,
  connectionLoading,
  isDeviceConnected
} : WateringCardDataProps) => {
  const token = useSelector(getToken)
  const userId = useSelector(getUserId)
  const dispatch = useDispatch()

  // first, static info from device received
  const deviceId = _.get(device, '_id')
  const deviceSettings = _.get(device, 'settings[0]') // TODO: when introduce many settings, remove it
  const automationSettings = _.get(deviceSettings, 'automation')
  const autoWateringModeEnabled = _.get(automationSettings, 'enabled')

  const [updatedWateringStatus, setUpdatedWateringStatus] = useState({
    manualRelayEnabled: false,
    autoRelayEnabled: false,
    dynamicAutoRemainingTime: 0
  })

  const {
    lastCommandReceived,
    wateringStatus = {}
} = deviceRealTimeData

const {
  wateringElapsedTime,
  autoRelayEnabled,
  manualRelayEnabled,
  dynamicAutoRemainingTime,
  nextTimeSlot
} = wateringStatus

const [wateringEnabled, setWateringEnabled] = useState(manualRelayEnabled)
const [autoModeEnabled, setAutoModeEnabled] = useState(autoWateringModeEnabled)

  useEffect(() => {
    setUpdatedWateringStatus(wateringStatus)
    setWateringEnabled(manualRelayEnabled)
  }, [dynamicAutoRemainingTime, autoRelayEnabled, manualRelayEnabled, nextTimeSlot])

  const handleSendCommand = async () => {
    if(wsStatus === WsReadyState.OPEN && isDeviceConnected) {
      const shouldEnableWatering = !wateringEnabled && lastCommandReceived !== NEW_COMMANDS.MANUAL_WATERING_ON.CODE
      const commandToSend = shouldEnableWatering
        ? NEW_COMMANDS.MANUAL_WATERING_ON.CODE
        : NEW_COMMANDS.MANUAL_WATERING_OFF.CODE

      const commandPayload = {
        commandCode: commandToSend,
        changedFrom: "App",
        userId,
        deviceId
      }
    
      const res = await callApi({ // TODO: add this to services
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
  
    let operationLabel = 'Indisponível' 
    let pulsingCircleType = 'offline'

    if (connectionLoading) {
      return <Loading />
    }

    if (isDeviceConnected) {
      pulsingCircleType = 'online'
      operationLabel = 'Disponível'
      
      if (manualRelayEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Irrigação manual ligada'
      }

      if (autoRelayEnabled) {
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

  const renderAutoWateringInfoLabel = () => {
    if (!autoModeEnabled) return ''

    if (autoModeEnabled && !autoRelayEnabled) {
      const currentTime = moment()

      const isSameDay = moment(nextTimeSlot).isSame(currentTime, 'day')

      if (!isSameDay) {
        return `Próxima ligação: ${moment(nextTimeSlot).format('DD/MM, HH:mm')}`
      }

      const nextCycleTime =
        moment(currentTime).clone().add(dynamicAutoRemainingTime, 'milliseconds')
  
      return `Próxima ligação: Hoje, ${moment(nextTimeSlot).format('HH:mm')}`
    }

    const interval = _.get(automationSettings, 'interval')
    const autoWateringEstimatedToEndAt = moment().clone().add(interval, 'minutes')
    const pastTime = moment(autoWateringEstimatedToEndAt).clone().subtract(wateringElapsedTime, 'milliseconds')

    const remainingTime = autoWateringEstimatedToEndAt.diff(pastTime)

    return `Termina em: ${moment(remainingTime).format('mm')} minutos` 
  }

  const renderManualWateringInfoLabel = () => {
    if (!wateringEnabled) return '' // TODO: adicionar loading enquanto nao tiver o status pois mostra 0 minutos

    const wateringTimer = _.get(automationSettings, 'wateringTimer')
    const autoWateringEstimatedToEndAt = moment().clone().add(wateringTimer, 'minutes')
    const pastTime = moment(autoWateringEstimatedToEndAt).clone().subtract(wateringElapsedTime, 'milliseconds')

    const remainingTime = autoWateringEstimatedToEndAt.diff(pastTime)

    return `Termina em: ${moment(wateringElapsedTime ? remainingTime : wateringTimer).format('mm')} minutos` 
  }
  
  return (
    <div className='watering-card'>
      {renderOperationLabel()}
      <div className='watering-card__options'>
        <div className='option option--toggle'>
          <span>Auto</span>
          <div>
            <Toggle
              disabled={connectionLoading || !isDeviceConnected}
              checked={autoModeEnabled}
              onChange={handleSendAutoCommand}
            />
          </div>
        </div>
        <span className='option__status-label'>
          {connectionLoading || !isDeviceConnected ? null : renderAutoWateringInfoLabel()}
        </span>
        <div className='option option--toggle'>
            <span>Manual</span>
            <Toggle
              disabled={connectionLoading || !isDeviceConnected}
              checked={wateringEnabled}
              onChange={handleSendCommand}
            />
        </div>
        {wateringEnabled
          ? <span className='option__status-label'>{renderManualWateringInfoLabel()}</span> 
          : null}
      </div>
      <div className='watering-card__bottom-label'>
        <CardLabel Icon={Leaf} label='Irrigação' />
      </div>
    </div>
  )
}