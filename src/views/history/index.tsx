import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import { getDefaultDeviceId } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'

import { CustomScatterChart } from './custom-scatter-chart'
import { fetchCommandHistory } from 'services/fetch'
import { CommandCard } from './command-card'
import { CommandType } from './types'

import './styles.scss'
import { DeviceSelector } from 'components/device-selector'

export const History = () => {
  const token = useSelector(getToken)
  const defaultDeviceId = useSelector(getDefaultDeviceId)

  const [commands, setCommands] = useState([])

  useEffect(() => {
    const retrieveCommandHistory = async () => {
      const todaysDate = moment().startOf('day').format()

      const history = await fetchCommandHistory({
        dayToRetrieveHistory: todaysDate,
        deviceId: defaultDeviceId,
        token
      })

      setCommands(history)
    }

    retrieveCommandHistory()
  }, [defaultDeviceId, token])

  const commandCards = _.map(commands, (command: CommandType) =>
    <CommandCard key={command._id} command={command} />)
  
  return (
    <div>
      <h1>Histórico</h1>
      <DeviceSelector />
      <CustomScatterChart />
      <div className='history__command-cards'>
        {commandCards}
      </div>
    </div>
  )
}