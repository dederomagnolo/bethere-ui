import { CustomDatePicker, DeviceSelector, Loading } from 'components'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PuffLoader } from 'react-spinners'
import _ from 'lodash'
import moment from 'moment'

import { getDefaultDeviceId } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'

import { getMeasuresHistory } from 'services/fetch'
import { CustomLineChart } from './custom-line-chart'

import './styles.scss'

const mergeMeasureBatchDataToPlot = (dataToMerge: any) => {
  const formattedData = [] as any
  _.forEach(dataToMerge, (batch, key: any) => {
    const formattedBatch = _.map(batch, (measure) => ({
      x: (moment(measure.createdAt)).valueOf(),
      [measure.origin]: measure.value,
    }))
    formattedData.push(formattedBatch)
  })

  return _.merge(formattedData[0], formattedData[1])
}

const mapToPlot = (dataToMap: any) => {
  return _.map(dataToMap, (measure) => ({
    x: (moment(measure.createdAt)).valueOf(),
    [measure.type]: measure.value,
  }))
}

export const Charts = () => {
  const token = useSelector(getToken)
  const deviceId = useSelector(getDefaultDeviceId)

  const todaysStartDate = moment().startOf('day')
  const startDateToQuery = moment(todaysStartDate).utc().format()

  const [measures, setMeasures] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todaysStartDate)
  
  const updateMeasuresHistory = async (dayToRetrieveHistory: any) => {
    const measuresHistory = await getMeasuresHistory({
      token,
      deviceId,
      dayToRetrieveHistory
    })
    setMeasures(_.get(measuresHistory, 'historyForDate'))
  }

  useEffect(() => {
    updateMeasuresHistory(startDateToQuery)
  }, [])

  const humidityChartData = _.pick(measures, 'externalHumidity', 'internalHumidity')
  const temperatureChartData = _.pick(measures, 'externalTemperature', 'internalTemperature')

  const handleDateChange = async (date : any) => {
    const dateToQueryHistory = moment(date).startOf('day')
    setSelectedDate(dateToQueryHistory)
    await updateMeasuresHistory(moment(dateToQueryHistory).utc().format())
  }

  const renderCharts = () => {
    let mapped = { temperature: [], humidity: []}
    _.forEach(measures, (sensor, index) => {
      const groupedByType = _.groupBy(sensor, 'origin')
      mapped = { ...mapped, [index]: groupedByType }
    })

    const measureTypes = _.keys(mapped)
    const mappedCharts = _.map(mapped, (measureType, key: any) => {
      const dataToPlot = mergeMeasureBatchDataToPlot(measureType)
      const keys = _.keys(measureType)
      return (
        <div className='charts__chart-container'>
          {loading
            ? <Loading Component={PuffLoader} />
            : <CustomLineChart
              measureType={key}
              dataToPlot={dataToPlot}
              lineDataKeys={keys}
              dateToAjdustTicks={selectedDate} />}
        </div>
      )
    })
    return (
      <div className='charts'>
        {mappedCharts}
      </div>
    )
  }

  return(
    <div>
      <h2>Gráficos</h2>
      <DeviceSelector />
      <CustomDatePicker value={selectedDate} onChange={handleDateChange} />
      {renderCharts()}
    </div>
  )
}