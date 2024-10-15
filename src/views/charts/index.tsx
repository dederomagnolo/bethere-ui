import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PuffLoader } from 'react-spinners'
import _ from 'lodash'
import moment from 'moment'

import { Button, CustomDatePicker, Loading } from 'components'

import { useFetch } from 'hooks/useFetch'

import { getUserSensors } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'

import { getAllUserMeasures } from 'services/measures'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import './styles.scss'
import { COMMAND_CATEGORIES, MEASURE_TYPES } from 'global/consts'
import { ChartWithFilters } from './chart-with-filters'

import { Filter, buildDataToPlot } from './utils/build-data-to-plot'
import { fetchAllUserCommands } from 'services/commands/fetch-all-user-commands'

export const Charts = () => {
  const token = useSelector(getToken)
  const userSensors = useSelector(getUserSensors)

  const todaysStartDate = moment().startOf('day')
  const startDateToQuery = moment(todaysStartDate).utc().format()

  const [data, setData] = useState({})
  const [commandData, setCommandData] = useState([]) as any // REMOVE IT AFTER TESTS
  const [filters, setFilters] = useState<Filter>({})

  const [measuresCollectionsToPlot, setMeasuresCollectionsToPlot] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todaysStartDate)

  const sensorNames = userSensors.map((sensor) => ({
    serialKey: sensor.serialKey,
    name: sensor.name
  }))

  const updateMeasures = async (dayToRetrieveHistory: any) => {
    try {
      setLoading(true)
      const measuresHistory = await getAllUserMeasures({
        dayToRetrieveHistory,
        token
      })

      const commandsHistory = await fetchAllUserCommands({
        dayToRetrieveHistory: dayToRetrieveHistory,
        token
      })


      // move it to a function
      const filteredCommands =
        _.filter(commandsHistory, (command) =>
          !(command.commandCode || command.commandName).includes('SET_AW_TIMER') && 
          (command.categoryName === COMMAND_CATEGORIES.MANUAL_WATERING.NAME
          || command.categoryName === COMMAND_CATEGORIES.AUTO_WATERING.NAME)
        )

      const formattedCommandHistory = _.map(filteredCommands, (command) => ({
        c: command.commandCode || command.commandName, // TODO: remove commandName when migration is done
        x: (moment(command.createdAt)).valueOf()
      }))

      setCommandData(formattedCommandHistory)

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

  const mappedCharts = _.map(measuresCollectionsToPlot, (collectionToPlot: any, type: number) => {
    if (loading) {
      return <Loading key={type} Component={PuffLoader} />
    }

    return (
      <ChartWithFilters
        key={type}
        secondBatch={commandData}
        setFilters={setFilters}
        filters={filters}
        collectionToPlot={collectionToPlot}
        measureType={type}
        sensorsInfoFromAccount={sensorNames}
        selectedDate={selectedDate} />
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
      {_.isEmpty(data) ? <div className='charts-view__not-found'>Sem registros nessa data.</div> : mappedCharts }
    </div>
  )
}