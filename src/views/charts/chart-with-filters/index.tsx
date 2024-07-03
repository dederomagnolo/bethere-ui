import { Loading, Checkbox } from "components"
import { MEASURE_TYPES } from "global/consts"
import _ from "lodash"
import { PuffLoader } from "react-spinners"
import { CustomLineChart } from "../custom-line-chart"

export const ChartWithFilters = ({
  setFilters,
  filters,
  collectionToPlot,
  measureType,
  sensorsInfoFromAccount,
  selectedDate
}: any) => {
  const shouldRenderChart = !_.isEmpty(collectionToPlot)
  const labelForType = MEASURE_TYPES[measureType].label
  const dataToPlot = collectionToPlot.data
  const sensorsOnCollection = collectionToPlot.dataKeys
  const filtersOnCollection = filters[measureType]

  const applyFilterOnCharts = (serialKey: string, e: any) => {
    const checked = e.target.checked
    const alreadyApplied = filtersOnCollection && filtersOnCollection.length && filtersOnCollection.includes(serialKey)

    if (!alreadyApplied && !checked) {
      const updatedFilters = {
        ...filters,
        [measureType]: filtersOnCollection && filtersOnCollection.length ? filtersOnCollection.push(serialKey) : [serialKey]
      }
      setFilters(updatedFilters)
    }

    if (checked) {
      const updatedFilters = {
        ...filters,
        [measureType]: _.filter(filtersOnCollection, (filter) => filter !== serialKey)
      }
      setFilters(updatedFilters)
    }
  }

  const mappedSensorFilterOptions = _.map(sensorsOnCollection, (sensorSerialKey) => {
    const info = _.find(sensorsInfoFromAccount, (sensor) => sensor.serialKey === sensorSerialKey)
    const sensorName = info?.name || sensorSerialKey
    
    const isFiltered = filtersOnCollection && filtersOnCollection.includes(sensorSerialKey)
    
    let shouldDisableActiveForFiltering = false

    if (sensorsOnCollection && filtersOnCollection) {
      shouldDisableActiveForFiltering = sensorsOnCollection.length - filtersOnCollection.length === 1
    }

    return (
      <Checkbox
        disabled={shouldDisableActiveForFiltering && !isFiltered}
        checked={!isFiltered}
        key={sensorName}
        onChange={(e) => applyFilterOnCharts(sensorSerialKey, e)} //
        label={sensorName} />
      ) 
  })

  return (
    <div className='charts__chart-container' key={measureType}>
      <h2>{labelForType}</h2>
      <div className='charts__filters-container'>
        <h4>Mostrar:</h4>
        {mappedSensorFilterOptions}
      </div>
      {shouldRenderChart ? (
        <CustomLineChart
          sensors={sensorsInfoFromAccount}
          key={measureType}
          measureType={measureType}
          dataToPlot={dataToPlot}
          lineDataKeys={sensorsOnCollection}
          dateToAjdustTicks={selectedDate} />) : null}
    </div>
  )
}