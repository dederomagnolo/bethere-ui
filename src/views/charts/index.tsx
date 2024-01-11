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
    const formattedBatch = _.map(batch, (measure: any, index: any) => {
      if (measure.value > 900) return null
      return {
        x: (moment(measure.createdAt)).valueOf(),
        [measure.origin]: measure.value
      }
    })
    formattedData.push(_.compact(formattedBatch))
  })

  return _.merge(formattedData[0], formattedData[1])
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


  const handleDateChange = async (date : any) => {
    const dateToQueryHistory = moment(date).startOf('day')
    setSelectedDate(dateToQueryHistory)
    await updateMeasuresHistory(moment(dateToQueryHistory).utc().format())
  }

  const renderCharts = () => {
    let mapped = {}
    _.forEach(measures, (sensor, index) => {
      const groupedByType = _.groupBy(sensor, 'origin')
      console.log({
        groupedByType
      })
      mapped = { ...mapped, [index]: groupedByType }
    })

    const mappedCharts = _.map(mapped, (measureType, key: any) => {
      const dataToPlot = mergeMeasureBatchDataToPlot(measureType)
      const keys = _.keys(measureType)

      if(loading) {
        return <Loading Component={PuffLoader} />
      }

      const shouldRenderChart = !_.isEmpty(dataToPlot)
      return (
        <div className='charts__chart-container'>
          {shouldRenderChart ? <CustomLineChart
              key={`${measureType}-${key}`}
              measureType={key}
              dataToPlot={dataToPlot}
              lineDataKeys={keys}
              dateToAjdustTicks={selectedDate} /> : null}
        </div>
      )
    })


    return (
      <div className='charts'>
        {!_.isEmpty(mapped) ? mappedCharts : <p>Não foram registradas medidas nesta data.</p>}
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