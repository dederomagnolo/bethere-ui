import { useEffect, useState } from 'react'
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

export const History = () => {
  const token = useSelector(getToken)
  const defaultDeviceId = useSelector(getDefaultDeviceId)

  const todaysStartDate = moment().startOf('day')
  const startDateToQuery = moment(todaysStartDate).utc().format()

  const [commands, setCommands] = useState([])
  const [hideChart, setHideChart] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todaysStartDate)

  const retrieveCommandHistory = async (dayToRetrieveHistory?: string) => {
    const todaysDate = moment().startOf('day').format()

    const history = await fetchCommandHistory({
      dayToRetrieveHistory: dayToRetrieveHistory,
      deviceId: defaultDeviceId,
      loadingCallback: setLoadingHistory,
      token
    })
    setCommands(_.get(history, 'historyForDate'))
  }

  useEffect(() => {
    retrieveCommandHistory(startDateToQuery)
  }, [defaultDeviceId, token])

  const commandCards = _.map(commands, (command: CommandType) =>
    <CommandCard key={command._id} command={command} />)

  const handleDateChange = async (date: any) => {
    const formattedDate = moment(date)
    setSelectedDate(formattedDate)

    await retrieveCommandHistory(formattedDate.format())
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
            <CustomSelect />
          </div>
        </div>
        {loadingHistory ? <Loading Component={PuffLoader} /> : (
          <div className='history__data'>
            <div className='history__chart'>
              <div className='history__chart__title'>
                <h2>Linha do tempo</h2>
                <IconWithTooltip />
              </div>
              {!hideChart && <CustomScatterChart dataToPlot={commands} />}
            </div>
            <h2>Histórico</h2>
            <div className='history__command-cards'>
              {commandCards}
            </div>
          </div>)}
      </div>
    </div>
  )
}