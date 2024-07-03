import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PuffLoader } from 'react-spinners'
import _ from 'lodash'
import moment from 'moment'

import { Button, Checkbox, CustomDatePicker, Loading } from 'components'

import { useFetch } from 'hooks/useFetch'

import { getUserSensors } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'

import { getAllUserMeasures } from 'services/measures'
import { CustomLineChart } from './custom-line-chart'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import './styles.scss'
import { MEASURE_TYPES } from 'global/consts'

// console.log({tick})
// const outMax = 100
// const outMin = 0
// const inMax = 270
// const inMin = 556

// const normalizedTick = 
//   ((Number(tick) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

const getNormalizedValue = (value: number) => {
  const outMax = 100
  const outMin = 0
  const inMax = 270
  const inMin = 700 // linear coeficient
  const angularCoeficient = (outMax - outMin) / (inMax - inMin)

  const normalizedTick = angularCoeficient * value + 556

  const percentual = normalizedTick * 100 / 700
  return Number(percentual.toFixed(2))
}

const buildDataToPlot = (measuresCollectionByType: any, filters: Filter = {}) => {
  let availableToPlot = {}

  _.forEach(measuresCollectionByType, (collection, type: number) => {
    const collectionFilters = filters[type]
    const batch = [] as any
    const dataKeys = [] as string[]

    _.forEach(collection, (measure: any) => { // get data to plot from collection
      const measureType = measure.type
      const value = measure.value
      const origin = measure.origin

      const shouldIncludeMeasure = measureType !== 'moisture' && value !== 998

      if (shouldIncludeMeasure) {
        if (!dataKeys.includes(origin)) {
          dataKeys.push(origin)
        }

        const hasFiltersToApply = collectionFilters && collectionFilters.length
        const shouldFilterMeasure = hasFiltersToApply && collectionFilters.includes(origin)

        const xTick = (moment(measure.createdAt)).valueOf()
        const point = {
          x: xTick,
          [origin]: measureType === 'moisture' ? getNormalizedValue(value) : value,
        }

        if (!shouldFilterMeasure) {
          batch.push(point)
        }
      } 
    })

    availableToPlot = {
      ...availableToPlot,
      [type]: {
        data: batch,
        dataKeys: dataKeys
      }
    }
  })

  return availableToPlot
}

type Filter = {
  [key: string]: string[]
}

export const Charts = () => {
  const token = useSelector(getToken)
  const userSensors = useSelector(getUserSensors)

  const todaysStartDate = moment().startOf('day')
  const startDateToQuery = moment(todaysStartDate).utc().format()

  const [data, setData] = useState({})
  const [filters, setFilters] = useState<Filter>({})

  const [measuresCollectionsToPlot, setMeasuresCollectionsToPlot] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todaysStartDate)

  const sensorNames = userSensors.map((sensor) => ({
    serialKey: sensor.serialKey,
    name: sensor.name
  }))

  const updateMeasures = async (dayToRetrieveHistory: any) => { // by user
    try {
      setLoading(true)
      const measuresHistory = await getAllUserMeasures({
        dayToRetrieveHistory,
        token
      })

      const allMeasures = _.get(measuresHistory, 'historyByAllDevices')
      setData(allMeasures)

      const allMeasuresToPlot = buildDataToPlot(allMeasures)
      setMeasuresCollectionsToPlot(allMeasuresToPlot)

      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    const allMeasuresToPlot = buildDataToPlot(data, filters)
    setMeasuresCollectionsToPlot(allMeasuresToPlot)
  }, [filters])

  useFetch(async () => {
    return await updateMeasures(startDateToQuery)
  }, [])

  const handleDateChange = async (date : any) => {
    const dateToQueryHistory = moment(date).startOf('day')
    setSelectedDate(dateToQueryHistory)
    await updateMeasures(moment(dateToQueryHistory).utc().format())

    setFilters({})
  }

  const renderCharts = _.map(measuresCollectionsToPlot, (collectionToPlot: any, type: number) => {
    const dataToPlot = collectionToPlot.data
    const sensorsOnCollection = collectionToPlot.dataKeys
    const filtersOnCollection = filters[type]

    if (loading) {
      return <Loading key={type} Component={PuffLoader} />
    }

    const applyFilterOnCharts = (serialKey: string, e: any) => {
      const checked = e.target.checked
      const alreadyApplied = filtersOnCollection && filtersOnCollection.length && filtersOnCollection.includes(serialKey)

      if (!alreadyApplied && !checked) {
        const updatedFilters = {
          ...filters,
          [type]: filtersOnCollection && filtersOnCollection.length ? filtersOnCollection.push(serialKey) : [serialKey]
        }
        setFilters(updatedFilters)
      }

      if (checked) {
        const updatedFilters = {
          ...filters,
          [type]: _.filter(filtersOnCollection, (filter) => filter !== serialKey)
        }
        setFilters(updatedFilters)
      }
    }

    const mappedSensorFilterOptions = _.map(sensorNames, (sensor) => {
      const serialKey = sensor.serialKey
      const sensorName = sensor.name || serialKey
      
      const onCollection = sensorsOnCollection && sensorsOnCollection.includes(serialKey)
      const isFiltered = filtersOnCollection && filtersOnCollection.includes(serialKey)
      
      let shouldDisableActiveForFiltering = false

      if (sensorsOnCollection && filtersOnCollection) {
        shouldDisableActiveForFiltering = sensorsOnCollection.length - filtersOnCollection.length === 1
      }

      return onCollection 
        ? <Checkbox
            disabled={shouldDisableActiveForFiltering && !isFiltered}
            checked={!isFiltered}
            key={sensorName}
            onChange={(e) => applyFilterOnCharts(serialKey, e)} //
            label={sensorName} /> 
        : null
    })

    const shouldRenderChart = !_.isEmpty(collectionToPlot)
    
    const labelForType = MEASURE_TYPES[type].label

    return (
      <div className='charts__chart-container' key={type}>
        <h2>{labelForType}</h2>
        <div className='charts__filters-container'>
          <h4>Mostrar:</h4>
          {mappedSensorFilterOptions}
        </div>
        {shouldRenderChart ? (
          <CustomLineChart
            sensors={sensorNames}
            key={type}
            measureType={type}
            dataToPlot={dataToPlot}
            lineDataKeys={sensorsOnCollection}
            dateToAjdustTicks={selectedDate} />) : null}
      </div>
    )
  })

  const exportData = (data: any) => {
    const fileNameToSave = moment(selectedDate).format('DD-MM-YYYY')
    const workbook = XLSX.utils.book_new()

    _.forEach(data, (collectionByMeasureType, type) => {
      const typeLabel = MEASURE_TYPES[type].label
      const groupedBySensor = _.groupBy(collectionByMeasureType, 'origin')
      
      _.forEach(groupedBySensor, (collectionBySensor, key) => {
        const filteredDataToExport = _.map(collectionBySensor, (measure) => {
          return {
            Tipo: typeLabel,
            Valor: measure.value,
            Data: measure.createdAt
          }
        })
        const worksheet = XLSX.utils.json_to_sheet(filteredDataToExport)
        XLSX.utils.book_append_sheet(workbook, worksheet, `${typeLabel}-${key}`)
      })
    })

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })

    saveAs(blob, `Medições-BeThere-${fileNameToSave}.xlsx`)
  }

  return(
    <div className='charts-view'>
      <h2>Gráficos</h2>
      <div className='charts-view__actions'>
        <CustomDatePicker value={selectedDate} onChange={handleDateChange} />
        {!_.isEmpty(data) && <Button className='export-button' onClick={() => exportData(data)}>Exportar</Button>}
      </div>
      {_.isEmpty(data) ? <div className='charts-view__not-found'>Sem registros nessa data.</div> : renderCharts }
    </div>
  )
}