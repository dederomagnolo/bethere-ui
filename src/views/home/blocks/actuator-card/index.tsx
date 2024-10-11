import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  FaLeaf as Leaf,
} from 'react-icons/fa'

import { AppCard, Button, Loading, Toggle } from 'components'

import { NEW_COMMANDS } from 'global/consts'

import { Actuator, ActuatorRealTimeData, DeviceRealTimeData, Settings } from 'types/interfaces'

import { getStatusFromLocalStation, writeCommand } from 'services/local-station'

import { getToken } from 'redux/user/selectors'

import './styles.scss'
import { editSettingsAndSendCommand } from 'services/fetch'
import { setUserDevices } from 'redux/device/actions'
import moment from 'moment'
import { Countdown } from 'components/countdown'
import { PulsingCircle } from 'components/ui-atoms/pulsing-circle'

interface Props {
  deviceSettings: Settings
  actuator: Actuator
  isDeviceConnected: boolean
  connectionLoading: boolean
  userId: string
  actuatorRealTimeData: ActuatorRealTimeData
}

export const ActuatorCard = ({
  deviceSettings,
  actuator,
  isDeviceConnected,
  userId,
  connectionLoading,
  actuatorRealTimeData
}: Props) => {
  const dispatch = useDispatch()
  const token = useSelector(getToken)

  const {
    lastCommandReceived = '',
    operationStatus = {},
  } = actuatorRealTimeData

  const {
    lastActivated,
    nextTimeSlot,
    wateringElapsedTime, // TODO: REMOVER DO BROADCAST
    autoRelayEnabled,
    manualRelayEnabled,
    dynamicAutoRemainingTime // TODO: REMOVER DO BROADCAST
  } = operationStatus as ActuatorRealTimeData['operationStatus']

  const {
    automation: {
      enabled: autoWateringModeEnabled
    }
  } = deviceSettings

  const [dynamicCountdownInMs, setDynamicCountdownInMs] = useState<number | undefined>(undefined)
  const [manualOperationEnabled, setManualOperationEnabled] = useState(manualRelayEnabled)
  const [autoModeEnabled, setAutoModeEnabled] = useState(autoWateringModeEnabled)

  useEffect(() => {
    if (!manualRelayEnabled && manualOperationEnabled) {
      setManualOperationEnabled(false)
    }
  }, [autoRelayEnabled, manualRelayEnabled])

  useEffect(() => {

    if (manualOperationEnabled) {
      const willEndAt = moment(lastActivated).add(deviceSettings.wateringTimer, 'minutes')
      const diff = moment(willEndAt).diff(moment(), 'milliseconds')
      // console.log({ 
      //   willEndAt: willEndAt.format('hh:mm:ss'),
      //   lastActivated, 
      //   current: moment().format('hh:mm:ss') 
      // })

      setDynamicCountdownInMs(diff)
    }
  }, [lastActivated])

  console.log({ dynamicCountdownInMs })

  const actuatorLastActivatedAt = actuator.lastActivated
  const formattedLastActivated = moment(actuatorLastActivatedAt).isValid()
    ? moment(actuatorLastActivatedAt).format("DD/MM/YY, HH:mm")
    : 'Sem registro'

  const handleSendAutoCommand = async () => {
    const settingsId = deviceSettings._id
    const res = await editSettingsAndSendCommand({
        token,
        settingsPayload: {
          settingsId, 
          deviceId: deviceSettings.deviceId,
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

  const handleSendCommand = async () => {
    if (isDeviceConnected) {
      const shouldEnableWatering =
        !manualOperationEnabled && lastCommandReceived !== NEW_COMMANDS.MANUAL_WATERING_ON.CODE
      const commandToSend = shouldEnableWatering
        ? NEW_COMMANDS.MANUAL_WATERING_ON.CODE
        : NEW_COMMANDS.MANUAL_WATERING_OFF.CODE

      const commandPayload = {
        commandCode: commandToSend,
        changedFrom: "App",
        userId: userId,
        deviceId: deviceSettings.deviceId
      }
    
      const res = await writeCommand({
        token,
        payload: commandPayload,
      })

      if (res) {
        setManualOperationEnabled(!manualOperationEnabled)

        const willEndAt = moment().add(deviceSettings.wateringTimer, 'minutes')
        const diff = moment(willEndAt).diff(moment(), 'milliseconds')
        // console.log({ 
        //   willEndAt: willEndAt.format('hh:mm:ss'),
        //   lastActivated, 
        //   current: moment().format('hh:mm:ss') 
        // })

        setDynamicCountdownInMs(diff)
      }
    }
  }

  const interruptAllOperations = async () => {
    let commandToSend = ''

    if (autoRelayEnabled) {
      commandToSend = NEW_COMMANDS.AUTO_WATERING_OFF.CODE
    }

    if (manualRelayEnabled) {
      commandToSend = NEW_COMMANDS.MANUAL_WATERING_OFF.CODE
    }

    if (isDeviceConnected && commandToSend !== '') {
      const commandPayload = {
        commandCode: commandToSend,
        changedFrom: "App",
        userId: userId,
        deviceId: deviceSettings.deviceId
      }
    
      const res = await writeCommand({
        token,
        payload: commandPayload,
      })
      return
    }
  }

  const renderNextAutoOperationLabel = () => {
    if (autoModeEnabled && !autoRelayEnabled) {
      const currentTime = moment()
      const isSameDay = moment(nextTimeSlot).isSame(currentTime, 'day')

      if (!isSameDay) return `${moment(nextTimeSlot).format('DD/MM, HH:mm')}`
      
      return `Hoje, ${moment(nextTimeSlot).format('HH:mm')}`
    }

    return ''
  }

  const nextAutoOperationLabel = (
    autoModeEnabled ? (
      <div className='right-block right-block--auto-off'>
        <div className='status__mini-label'>
          Próxima ligação: {renderNextAutoOperationLabel()}
        </div>
      </div>
    ) : null
  )

  const statusRightBlock = autoRelayEnabled || manualRelayEnabled ? (
    <div className='right-block'>
      {autoRelayEnabled ? <div className='button-container'>
        <Button
          className='interrupt-button'
          variant='cancel'
          onClick={interruptAllOperations}>
          Interromper operação
        </Button>
      </div> : null}
      <div className='status__mini-label remaining-time'>
        Tempo restante:
        {' '}
        <Countdown
          initialState={dynamicCountdownInMs}
          />
      </div>
    </div>
  ) : nextAutoOperationLabel

  const getLabelForConnectionStatus = () => {
    let operationLabel = 'Indisponível' 
    let pulsingCircleType = 'offline'

    if (connectionLoading) return <Loading />
    
    if (isDeviceConnected) {
      pulsingCircleType = 'online'
      operationLabel = 'Disponível'
      
      if (manualOperationEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Operação manual em progresso'
      }

      if (autoRelayEnabled) {
        pulsingCircleType = 'progress'
        operationLabel = 'Operação automática em progresso'
      }
    }

    return (
      <div className='connection-status'>
        <PulsingCircle type={pulsingCircleType} />
        <span>{connectionLoading ? 'loading' : operationLabel}</span>
      </div>
    )
  }

  const getLabelForActuatorCurrentStatus = () => {
    const unnavailable = <span className='status__current--off'>-</span>
    const status = autoRelayEnabled || manualOperationEnabled 
      ? <span className='status__current--on'>Ligado</span>
      : <span className='status__current--off'>Desligado</span>
      
    
    return (
      <div className='status__current'>
        Status: {isDeviceConnected ? status : unnavailable}
      </div>
    )
  }

  return (
    <AppCard>
      <div className='actuator-card'>
        <div className='header'>
          <div className='title'>
            {actuator.name || `Saída ${actuator.boardNumber}`}
            <Leaf width={22} height={22} />
          </div>
          {getLabelForConnectionStatus()}
        </div>
        <div className='content'>
          <div className='status'>
            <div className='left-block'>
              {getLabelForActuatorCurrentStatus()}
              <div className='status__mini-label'>
                Última ligação: {formattedLastActivated}
              </div>
            </div>
          {statusRightBlock}
          </div>
          <div className='watering'>
            <div className='control'>
              <div>Auto</div>
              <Toggle
                disabled={connectionLoading || !isDeviceConnected}
                onChange={handleSendAutoCommand} checked={autoModeEnabled} />
            </div>
            <div className='watering__manual'>
              <div className='control'>
                <div>Manual</div>
                <Toggle
                  disabled={connectionLoading || !isDeviceConnected || autoRelayEnabled}
                  checked={manualOperationEnabled}
                  onChange={handleSendCommand} />
              </div>
              <div className='status__mini-label'>
                Duração: {deviceSettings.wateringTimer} minutos
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppCard>
  )
}