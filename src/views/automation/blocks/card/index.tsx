import { Automation } from 'types/interfaces'
import './styles.scss'
import { Toggle } from 'components'
import { useState } from 'react'
import { ProgramCard } from '../program-card'

interface ActuatorCardProps {
  actuatorName: string
  actuatorNumber: number
  automation: Automation | undefined
  shouldAllowTriggerAutomation: boolean
}

export const Card = ({
  actuatorName,
  actuatorNumber,
  automation,
  shouldAllowTriggerAutomation
}: ActuatorCardProps) => {
  const [timerToggle, setTimerToggle] = useState(Boolean(automation?.timer.enabled))
  const [triggerToggle, setTriggerToggle] = useState(Boolean(automation?.trigger.enabled))

  return (
    <div className='card'>
      <div className='card__infos-top'>
        <div>
          Saída {actuatorNumber} | Estação local 
        </div>
        <div className='card__infos-top__name'>
          {actuatorName || `Saída ${actuatorNumber}`}
        </div>
      </div>
      <div className='card__infos-bottom'>
        <div className='card__automation-block'>
          <div className='card__toggle-container'>
            Timer
            <Toggle checked={timerToggle} onChange={() => {}} />
          </div>
          {automation ? <ProgramCard program={automation} /> : null}
        </div>
        {/* <div className='card__automation-block'>
          <div className='card__toggle-container'>
            Acionamento por sensor
            <Toggle
              disabled={true}
              checked={timerToggle}
              onChange={() => {}} />
          </div>
        </div> */}
      </div>
    </div>
  )
}