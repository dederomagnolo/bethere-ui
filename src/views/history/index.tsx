import { useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import PuffLoader from 'react-spinners/PuffLoader'

import {
  TbGraphOff as ChartOffIcon,
  TbGraph as ChartOnIcon
} from 'react-icons/tb'

import { getDefaultDeviceId } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'
import { fetchCommandHistory } from 'services/fetch'

import { Loading, CustomDatePicker, CustomSelect } from 'components'
import { CustomScatterChart } from './custom-scatter-chart'
import { CommandCard } from './command-card'
import { CommandType } from './types'

import './styles.scss'
import { DeviceSelector } from 'components/device-selector'
import { Tooltip } from 'react-tooltip'
import { useFetch } from 'hooks/useFetch'
import { MAPPED_COMMANDS } from 'global/consts'

const defaultOption = { value: 'all', label: 'Mostrar todos' }
const commandOptions = _.map(MAPPED_COMMANDS, (command) => {
  return { value: command.categoryName, label: command.categoryNameTranslated }
}).concat(defaultOption)

const defaultOptionIndex = commandOptions.length - 1

export const History = () => {
  const token = useSelector(getToken)
  const defaultDeviceId = useSelector(getDefaultDeviceId)

  const todaysStartDate = moment().startOf('day')
  const startDateToQuery = moment(todaysStartDate).utc().format()

  const [hideChart, setHideChart] = useState(true)
  const [selectedDate, setSelectedDate] = useState(startDateToQuery)
  const [filter, setFilter] = useState(commandOptions[defaultOptionIndex])

  const {
    data,
    error,
    loading
  } = useFetch(async () => await fetchCommandHistory({
    dayToRetrieveHistory: selectedDate,
    deviceId: defaultDeviceId,
    token
  }), [selectedDate])

  const handleDateChange = async (date: any) => {
    const formattedDate = moment(date).utc().format()
    setSelectedDate(formattedDate)
  }

  const IconWithTooltip = () => {
    const ChartIcon = ({ id } : { id: string}) => {
      return !hideChart
        ? <ChartOffIcon id={id} onClick={() => setHideChart(true)} />
        : <ChartOnIcon id={id} onClick={() => setHideChart(false)} />
    }

    return (
      <div className='history__chart__icon-container'>
        <Tooltip anchorSelect='#chart-icon'>
          {hideChart ? 'Mostrar gráfico' : 'Ocultar gráfico'}
        </Tooltip>
        <ChartIcon id='chart-icon' />
      </div>
    )
  }

  const commandsToFilter = ['@SET_AW_TIMER#']

  const renderHistoryData = () => {
    const historyForDate = _.get(data, 'historyForDate', []) 
    const filteredByInvalidCommands = _.filter(historyForDate, (command: any) => {
      const commandName = _.get(command, 'commandName')
      const invalidCommand = _.find(commandsToFilter, (commandToFilter) => commandName.includes(commandToFilter))
      return !invalidCommand
    } )
    const historyFilteredByCategoryName =
      filter.value !== 'all' 
        ? _.filter(filteredByInvalidCommands, (command: any) => command.categoryName === filter.value)
        : filteredByInvalidCommands
  
    const commandCards = _.map(historyFilteredByCategoryName, (command: CommandType) => {
      return <CommandCard key={command._id} command={command} />
    })
    
    return (
      historyForDate && historyForDate.length ? (
        <div className='history__data'>
          <div className='history__chart'>
            <div className='history__chart__title'>
              <h2>Linha do tempo</h2>
              <IconWithTooltip />
            </div>
            {!hideChart && <CustomScatterChart dataToPlot={historyFilteredByCategoryName} />}
          </div>
          <h2>Histórico</h2>
          <div className='history__command-cards'>
            {commandCards.length ? _.compact(commandCards) : 'Não foram registrados comandos nesta data.'}
          </div>
        </div>
      ) : (
        <div className='history__data'>
          Não foram registrados comandos nesta data.
        </div>
      )
    )
  }

  return (
    <div className='history'>
      <DeviceSelector />
      <div className='history__page-content'>
        <div className='history__selections'>
          <div className='history__date-container'>
            <CustomDatePicker
              clearIcon={null}
              onChange={handleDateChange}
              value={selectedDate} />
          </div>
          <div className='history__command-filter'>
            <h2>Filtro por comando</h2>
            <CustomSelect
              onChange={(value: any) => setFilter(value)}
              options={commandOptions}
              defaultValue={commandOptions[defaultOptionIndex]} />
          </div>
        </div>
        {loading ? <Loading Component={PuffLoader} /> : renderHistoryData()}
      </div>
    </div>
  )
}