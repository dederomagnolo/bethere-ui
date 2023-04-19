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
} from "recharts";

const data = [
  { x: 'MP1', y: '2023-04-17T05:53:47.154Z' },
  { x: 'MP1', y: '2023-04-17T12:19:47.154Z' },
  { x: 'MP0', y: '2023-04-17T13:12:47.112Z' },
  { x: 'MP0', y: '2023-04-17T19:35:47.132Z' },
  { x: 'MP0', y: '2023-04-17T23:47:01.024Z' },
];



const formattedData = data.map(row => ({
  x: row.x,
  y: (moment(row.y)).valueOf()
}))


// console.log({ tickNumericValues, formattedData })

const colors = { MP0: '#8884d8', MP1: '#378d32'} as any

export const CustomScatterChart = ({ dataToPlot }: any) => {
  const tickTimeStrings = []
  const startDate = moment().startOf('day')
  tickTimeStrings.push(startDate.format())

  for (let i = 0; i < 3; i++) {
    tickTimeStrings.push(startDate.add(6, 'hours').format())
  }

  const startDateToQuery = moment(startDate).utc().format()
  console.log({ startDateToQuery })
  const tickNumericValues = tickTimeStrings.map(timeString => moment(timeString).valueOf());

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
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        <CartesianGrid />
        <YAxis
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
          formatter={(value, name, props) => {
            return typeof(value) === 'string' ? value : moment(value).format('HH:mm')
          }}
          cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        {generateScatterComponents()}
      </ScatterChart>
    </ResponsiveContainer>
  );
}