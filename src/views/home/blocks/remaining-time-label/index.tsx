import _ from 'lodash'
import moment from 'moment'

export const RemainingTimeLabel = ({
  wateringEnabled,
  deviceSettings,
  wateringElapsedTime
}: any) => {
  const renderManualWateringInfoLabel = () => {
    if (!wateringEnabled) return '' // TODO: adicionar loading enquanto nao tiver o status pois mostra 0 minutos

    const wateringTimer = _.get(deviceSettings, 'wateringTimer')
    const autoWateringEstimatedToEndAt = moment().clone().add(wateringTimer, 'minutes')
    const pastTime = moment(autoWateringEstimatedToEndAt).clone().subtract(wateringElapsedTime, 'milliseconds')

    const remainingTime = autoWateringEstimatedToEndAt.diff(pastTime)

    return `Termina em: ${moment(wateringElapsedTime ? remainingTime : wateringTimer).format('mm')} minutos` 
  }
  
  return (
    <span className='option__status-label'>{renderManualWateringInfoLabel()}</span> 
  )
}