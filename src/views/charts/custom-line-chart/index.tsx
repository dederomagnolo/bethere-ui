
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import _ from 'lodash'
import moment from 'moment'
import { generateTicks } from 'global/functions'

const unityByType = {
  temperature: '°C',
  humidity: '%'
} as any

const sensors = {
  hf3ni: 'sensor externo',
  l8l8a: 'sensor interno'
} as any

export const CustomLineChart = ({
  dataToPlot,
  lineDataKeys = ['nop', 'nop'],
  dateToAjdustTicks,
  measureType
}: any) => {
  const ticks = generateTicks({
    date: dateToAjdustTicks,
    valueToIncrement: 30,
    momentType: 'minutes'
  })

  const initialTimeDomainPoint =  (moment(_.get(dataToPlot, '[0].x')).subtract(10, 'minutes')).valueOf()
  const finalTimeDomainPoint =
    (moment(_.get(dataToPlot, `[${dataToPlot.length - 1}].x`)).add(10, 'minutes')).valueOf()

  const adjustedTicks = _.compact(_.map(ticks, (tick) => 
    tick > initialTimeDomainPoint && tick < finalTimeDomainPoint ? tick : null))
  
  const initialYDomain = _.get(dataToPlot, `[0].${lineDataKeys[0]}`) - 2
  const finalYDomain = _.get(dataToPlot, `[${dataToPlot.length - 1}].${lineDataKeys[0]}`) + 2 
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={730}
        height={250}
        data={dataToPlot}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          ticks={adjustedTicks}
          dataKey='x'
          scale='time'
          type='number'
          domain={[initialTimeDomainPoint, finalTimeDomainPoint]}
          tickFormatter={(t) => moment(t).format('HH:mm')}
        />
        <YAxis
          tickFormatter={(tick) => `${tick}${unityByType[measureType]}`}
          type='number'
          scale='linear'
          domain={[initialYDomain, finalYDomain]} />
        <Tooltip 
          labelFormatter={(test) =>  moment(test).format('HH:mm')}/>
        <Legend formatter={(value: any) => {
            return sensors[value]}
          } />
        <Line type='monotone' dataKey={lineDataKeys[0]} stroke="#8884d8" />
        <Line type='monotone' dataKey={lineDataKeys[1]} stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}