import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import PuffLoader from 'react-spinners/PuffLoader'

import { getDefaultDeviceId } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'
import { fetchCommandHistory } from 'services/fetch'

import { Loading, CustomDatePicker } from 'components'
import { CustomScatterChart } from './custom-scatter-chart'
import { CommandCard } from './command-card'
import { CommandType } from './types'

import './styles.scss'
import { DeviceSelector } from 'components/device-selector'

export const History = () => {
  const token = useSelector(getToken)
  const defaultDeviceId = useSelector(getDefaultDeviceId)

  const [commands, setCommands] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null as any)

  const retrieveCommandHistory = async (dayToRetrieveHistory?: string) => {
    const todaysDate = moment().startOf('day').format()

    const history = await fetchCommandHistory({
      dayToRetrieveHistory: dayToRetrieveHistory ? dayToRetrieveHistory : todaysDate,
      deviceId: defaultDeviceId,
      loadingCallback: setLoadingHistory,
      token
    })

    setCommands(history)
  }

  useEffect(() => {
    retrieveCommandHistory()
  }, [defaultDeviceId, token])

  const commandCards = _.map(commands, (command: CommandType) =>
    <CommandCard key={command._id} command={command} />)

  const handleDateChange = async (date: any) => {
    const formattedDate = moment(date)
    setSelectedDate(formattedDate)

    await retrieveCommandHistory(formattedDate.format())
  }

  return (
    <div className='history'>
      <DeviceSelector />
      <div className='history__page-content'>
        <div className='history__date-container'>
          <CustomDatePicker
            clearIcon={null}
            onChange={handleDateChange}
            value={selectedDate} />
        </div>
        {loadingHistory ? <Loading Component={PuffLoader} /> : (
          <div className='history__data'>
            <div className='history__chart'>
              <h1>Linha do tempo</h1>
              <CustomScatterChart dataToPlot={commands} />
            </div>
            <h1>Histórico</h1>
            <div className='history__command-cards'>
              {commandCards}
            </div>
          </div>)}
      </div>
    </div>
  )
}