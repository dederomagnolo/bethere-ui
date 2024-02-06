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

  const getCommandTranslatedInfos = ({
    commandName, categoryName 
  }: { commandName: string, categoryName: string }) => {
    if(!commandName || !categoryName) return {}
    
    const category = _.find(MAPPED_COMMANDS, (command) => 
      command.categoryName === categoryName || command.categoryNameTranslated === categoryName)

    if(!category) return {}

    const commandInfo = 
      _.find(category.options, (option) => option.command === commandName)
    
    const commandStatus = _.get(commandInfo, 'status')
    const commandLabel = commandStatus === 'SET'
      ? _.get(category, 'commandNameTranslated')
      : category.categoryNameTranslated
      
    return {
      commandStatus,
      categoryNameTranslated: commandLabel
    }
  }

  const commandToRender = getCommandTranslatedInfos({ commandName, categoryName })

  if (_.isEmpty(commandToRender)) return null

  const {
    categoryNameTranslated,
    commandStatus
  } = commandToRender

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
        {/* <span>{commandName}</span> */}
        <span className={statusClassName}>{commandStatus}</span>
      </div>
    </div>
  )
}