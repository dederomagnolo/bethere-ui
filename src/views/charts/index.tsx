import { CustomDatePicker, DeviceSelector } from 'components'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { getDefaultDeviceId } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'

import { getMeasuresHistory } from 'services/fetch'
import { CustomLineChart } from './custom-line-chart'

export const Charts = () => {
  const token = useSelector(getToken)
  const deviceId = useSelector(getDefaultDeviceId)
  const [measures, setMeasures] = useState([])
  useEffect(() => {
    const updateMeasuresHistory = async () => {
      const measuresHistory = await getMeasuresHistory({
        loadingCallback: () => {},
        token,
        deviceId,
        dayToRetrieveHistory: '2023-04-18T21:00:00Z'
      })
      setMeasures(_.get(measuresHistory, 'historyForDate'))
      console.log({ measuresHistory })
    }

    updateMeasuresHistory()
  }, [])

  return(
    <div>
      <h1>Gráficos</h1>
      <DeviceSelector />
      <CustomDatePicker />
      <CustomLineChart dataToPlot={measures} />
    </div>
  )
}