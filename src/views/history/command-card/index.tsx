import _ from 'lodash'
import moment from 'moment'

import { CommandType } from '../types'
import { NEW_COMMANDS } from 'global/consts'

import './styles.scss'

interface CommandCardProps {
  command: CommandType
}

export const CommandCard: React.FC<CommandCardProps> = ({ command }) => {
  const {
    commandName,
    createdAt,
    changedValue
  } = command

  const commandStatusType: any = {
    'ON': 'on',
    'OFF': 'off',
    'SET': 'misc'
  }

  const COMMAND_INFOS = Object.values(NEW_COMMANDS)

  const commandInfoFromCollection = _.find(COMMAND_INFOS, (command) => commandName === command.CODE) || {} as any // maybe type here when it is finished on be

  if (_.isEmpty(commandInfoFromCollection)) return null

  const { CATEGORY: { LABEL_PT }, STATE } = commandInfoFromCollection

  const statusClassName = `command-card__info--${STATE ? commandStatusType[STATE] : 'misc'}`

  console.log({ changedValue})
  if (changedValue?.length) {

  }

  const mappedCommandHistory = _.map(changedValue, ({ from, to, paramName }) => {
    const FRIENDLY_LABELS = {
      'automation.interval': '',
      'automation.intervalInHours': '',
      'automation.startTime': '',
      'automation.endTime': '',
    }

    return (
      <div className='command-history__container'>
        <span>Parâmetro alterado: {paramName} </span>
        <span>De: {from} </span>
        <span>Para: {to} </span>
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
        {/* {changedValue?.length ? <div className='command-card__history'>
          {mappedCommandHistory}
        </div> : null} */}
      </div>
    </div>
  )
}