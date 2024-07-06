import moment from 'moment'
import _ from 'lodash'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

import { NEW_COMMANDS } from 'global/consts'

import './styles.scss'

const colors = {
  MP0: '#B1027C',
  MP1: '#0292B1',
  AW1: '#07BB19',
  AW0: '#FF424D',
  RESET: '#3437eb',
  SETTINGS: '#eba534'
} as any

export const CustomScatterChart = ({ dataToPlot }: any) => {
  const tickTimeStrings = []
  const startDate = moment().startOf('day')
  tickTimeStrings.push(startDate.format())

  for (let i = 0; i < 3; i++) {
    tickTimeStrings.push(startDate.add(6, 'hours').format())
  }

  const tickNumericValues = tickTimeStrings.map(timeString => moment(timeString).valueOf());

  const startDateToQuery = moment(startDate).utc().format()

  const formattedCommandHistory = _.map(dataToPlot, (command) => ({
    x: command.commandName,
    y: (moment(command.createdAt)).valueOf()
  }))

  const generateScatterComponents = () => {
    const dataPerCommand = _.groupBy(formattedCommandHistory, (item) => item.x)
    return _.map(dataPerCommand, (commandData, index) => {
      return <Scatter key={index} name={index} data={commandData} fill={colors[index]} />
    }
  )}

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const timeData = payload[0].value
      const commandData = payload[1].value

      const commandInfo = _.find(Object.values(NEW_COMMANDS), (command) => command.CODE === commandData)

      const formattedTime = typeof(timeData) === 'string' ? timeData : moment(timeData).format('HH:mm')

      const friendlyCommand = `${commandInfo?.CATEGORY.LABEL_PT} ${commandInfo?.STATE}` 
      return (
        <div className='custom-tooltip'>
          <p className='custom-tooltip__label'>{`Tempo : ${formattedTime}`}</p>
          <p className='custom-tooltip__label'>{`Comando : ${friendlyCommand}`}</p>
        </div>
      )
    }

    return <div></div>
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
        data={dataToPlot}
      >
        <CartesianGrid />
        <YAxis
          tick={{ fontSize: 8 }}
          tickFormatter={(t) => {
            const commandInfo = _.find(Object.values(NEW_COMMANDS), (command) => command.CODE === t)
            return commandInfo?.STATE || commandInfo?.CATEGORY.LABEL_PT || ''
          }}
          allowDuplicatedCategory={false}
          type='category'
          dataKey='x'
          name='command' />
        <XAxis
          ticks={tickNumericValues}
          tickFormatter={(t) => moment(t).format('HH:mm')}
          type='number'
          dataKey='y'
          name='time'
          scale='time'
          domain={[tickNumericValues[0], tickNumericValues[3]]}
        />
        <Tooltip
          content={<CustomTooltip />} />
        <Legend
          formatter={(t) => {
            const commandInfo = _.find(Object.values(NEW_COMMANDS), (command) => command.CODE === t)
            return `${commandInfo?.CATEGORY.LABEL_PT} ${commandInfo?.STATE}`
          }} />
        {generateScatterComponents()}
      </ScatterChart>
    </ResponsiveContainer>
  )
}