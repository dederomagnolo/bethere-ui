
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
import { generateTicks } from 'global/functions';

export const CustomLineChart = ({
  dataToPlot
}: any) => {
  const grouped = _.groupBy(dataToPlot, 'measureName')

  const ticks = generateTicks({
    valueToIncrement: 30,
    momentType: 'minutes'
  })

  console.log({ grouped, ticks})

  const humidityChartData = _.pick(grouped, 'externalHumidity', 'internalHumidity')

  const formattedData = [] as any
  _.forEach(humidityChartData, (batch, key: any) => {
    const formattedBatch = _.map(batch, (measure) => ({
      x: (moment(measure.createdAt)).format('HH:mm'),
      y: measure.value,
      name: measure.measureName
    }))

    formattedData.push({
      measureName: key,
      formattedBatch
    })
  })

  console.log({ humidityChartData, formattedData })
  const formattedBatch = _.get(formattedData[0], 'formattedBatch')

  let initialDomainPoint = 0
  let finalDomainPoint = 0
  if(formattedBatch) {
    initialDomainPoint = _.get(formattedBatch, '[0].x')
    finalDomainPoint = _.get(formattedBatch, `[${formattedBatch.length} - 1].x`)
  }


  console.log({initialDomainPoint, finalDomainPoint})

  const adjustedTicks = _.compact(_.map(ticks, (tick) => 
    tick > initialDomainPoint && tick < finalDomainPoint ? tick : null))
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={730}
        height={250}
        data={_.get(formattedData[0], 'formattedBatch)')}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          ticks={adjustedTicks}
          dataKey='x'
          scale='time'
          type='number'
          domain={[initialDomainPoint, finalDomainPoint]}
          tickFormatter={(t) => moment(t).format('HH:mm')}
        />
        <YAxis type='number' />
        <Tooltip 
          labelFormatter={(test) => {
          return moment(test).format('HH:mm')
        }}/>
        <Legend />
        <Line type='monotone' dataKey='y' stroke="#8884d8" />
        {/* <Line type='monotone' dataKey='y' stroke="#82ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  )
}