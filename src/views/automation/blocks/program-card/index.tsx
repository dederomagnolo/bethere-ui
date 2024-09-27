import { AutomationType } from 'types/enums'
import { Automation } from 'types/interfaces'

import './styles.scss'
import { EditIconWithTooltip } from 'components'

interface Props {
  program: Automation
  cardOnClick?: () => void
}

export const ProgramCard = ({ program, cardOnClick }: Props) => {
  const { trigger, timer, name, type } = program

  if (type === AutomationType.TRIGGER) {

  }

  const { startTime, endTime, interval, duration, intervalInHours } = timer

  return (
    <div className='program-container' onClick={cardOnClick} >
      <div className='program-container__name'>
        Programa: {name || 'Sem nome'}
        {cardOnClick
          ? null
          : <EditIconWithTooltip
              uniqueId='automation-edit'
              shouldToggleToShowSave={false} />}
      </div>
      <div className='program-container__cycle'>
        <div>Início: {startTime}h </div>
        🞄
        <div>Fim: {endTime}h </div>
      </div>
      <div className='program-container__params'>
        <div>Intervalo: {interval} {intervalInHours ? 'horas' : 'minutos'} </div>
        <div>Duração: {duration} minutos</div>
      </div>
    </div>
  )
}