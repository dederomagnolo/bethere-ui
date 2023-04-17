import _ from 'lodash'
import moment from 'moment'

import { CommandType } from '../types'
import { MAPPED_COMMANDS } from 'global/consts'

import './styles.scss'

interface CommandCardProps {
  command: CommandType
}

export const CommandCard: React.FC<CommandCardProps> = ({ command }) => {
  const {
    commandName,
    createdAt,
    categoryName
  } = command

  console.log(MAPPED_COMMANDS)

  const getCommandTranslatedInfos = ({ 
    commandName, categoryName 
  }: { commandName: string, categoryName: string }) => {
    if(!commandName || !categoryName) return {}
    

    const category = _.find(MAPPED_COMMANDS, (command) => 
      command.categoryName === categoryName)

    if(!category) return {}

    const commandInfo = 
      _.find(category.options, (option) => option.command === commandName)
      
    return {
      commandStatus: commandInfo.status,
      categoryNameTranslated: category.categoryNameTranslated
    }
  }

  const {
    categoryNameTranslated,
    commandStatus
  } = getCommandTranslatedInfos({ commandName, categoryName })

  const commandStatusType: any = {
    'ON': 'on',
    'OFF': 'off',
    'SET': 'misc'
  }

  const statusClassName = `command-card__info--${commandStatus ? commandStatusType[commandStatus] : 'misc'}`

  return (
    <div className='command-card'>
      <div className='command-card__time'>{moment(createdAt).format('HH:mm')}</div>
      <div className='command-card__info'>
        <span>{categoryNameTranslated}</span>
        <span className={statusClassName}>{commandStatus}</span>
      </div>
    </div>
  )
}