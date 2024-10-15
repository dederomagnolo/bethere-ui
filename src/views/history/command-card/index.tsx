import _ from 'lodash'
import moment from 'moment'

import { CommandType } from '../types'
import { NEW_COMMANDS } from 'global/consts'

import './styles.scss'

interface CommandCardProps {
  command: CommandType
}

const PARAM_UNITIES = {
  settingsName: 'name',
  broadcastWateringStatusInterval: 'minutes', // confirm
  localMeasureInterval: 'minutes', //confirm
  remoteMeasureInterval: 'minutes',
  wateringTimer: 'minutes',
  automation: {
    enabled: 'bool',
    duration: 'minutes',
    interval: 'minutes',
    intervalInHours: 'bool',
    startTime: 'hours',
    endTime: 'hours',
  }
}

const friendlyUnities = {
  minutes: 'mins',
  hours: 'h' 
} as any

export const CommandCard: React.FC<CommandCardProps> = ({ command }) => {
  const commandCode = command.commandCode || command.commandName // TODO: remove commandName when migration is done
  
  const {
    createdAt,
    changedValues
  } = command

  const commandStatusType: any = {
    'ON': 'on',
    'OFF': 'off'
  }

  const COMMAND_INFOS = Object.values(NEW_COMMANDS)

  const commandInfoFromCollection =
    _.find(COMMAND_INFOS, (command) => commandCode === command.CODE) || {} as any // maybe type here when it is finished on be

  if (_.isEmpty(commandInfoFromCollection)) return null

  const { CATEGORY: { LABEL_PT }, STATE } = commandInfoFromCollection

  const statusClassName = `command-card__info--${STATE ? commandStatusType[STATE] : ''}`

  const mappedCommandHistory = _.map(changedValues, ({ from, to, paramLabel, paramPath, _id }) => {
    const unity = _.get(PARAM_UNITIES, paramPath)

    let normalizedFromTo = { from, to }
    
    if (unity === 'bool') { // think different, please
      normalizedFromTo = {
        from: from === 'true' ? 'Ligado' : 'Desligado',
        to: to === 'true' ? 'Ligado' : 'Desligado'
      }
    }

    const showUnity = unity === 'minutes' || unity === 'hours'

    return (
      <div className='command-history__container' key={_id}>
        <div className='command-history__param'>
          <span className='command-history__title'>Parâmetro alterado: </span>
          <span>{paramLabel}</span>
        </div>
        <div className='command-history__from-to'>
          <div>
            <span className='command-history__title'>De: </span>
            <span>{normalizedFromTo.from}</span>
            {showUnity && <span className='command-history__unity'> {friendlyUnities[unity]}</span>}
          </div>
          <div>
            <span className='command-history__title'>Para: </span>
            <span>{normalizedFromTo.to}</span>
            {showUnity && <span className='command-history__unity'> {friendlyUnities[unity]}</span>}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className='command-card'>
      <div className='command-card__time'>{moment(createdAt).format('HH:mm')}</div>
      <div className='command-card__command'>
        <div className='command-card__info'>
          <span>{LABEL_PT}</span>
          <span className={statusClassName}>{STATE}</span>
        </div>
        {changedValues?.length ? <div className='command-card__history'>
          {mappedCommandHistory}
        </div> : null}
      </div>
    </div>
  )
}