
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
import { MEASURE_TYPES } from 'global/consts';

const strokes = ["#82ca9d", "#8884d8", "#8884d8"] as any

export const CustomLineChart = ({
  dataToPlot,
  lineDataKeys = ['nop', 'nop'],
  dateToAjdustTicks,
  measureType,
  sensors
}: any) => {

  const ticks = generateTicks({
    date: dateToAjdustTicks,
    valueToIncrement: 30,
    momentType: 'minutes'
  })

  const getYDomainByUnitType = () => {
    // if (measureType === 'moisture') {
    //   const initialYDomain = _.get(dataToPlot, `[0].${lineDataKeys[0]}`) - 50
    //   const finalYDomain = _.get(dataToPlot, `[${dataToPlot.length - 1}].${lineDataKeys[0]}`) + 50
      
    //   return {
    //     initialYDomain,
    //     finalYDomain
    //   }
    // }

    const initialYDomain = _.get(dataToPlot, `[0].${lineDataKeys[0]}`) - 2
    const finalYDomain = _.get(dataToPlot, `[${dataToPlot.length - 1}].${lineDataKeys[0]}`) + 2

    if (measureType === 'temperature') {
      return {
        initialYDomain: 5,
        finalYDomain: 40
      }
    }
 
    if (measureType === 'humidity') {
      return {
        initialYDomain: 0,
        finalYDomain: 100
      }
    }

    return {
      initialYDomain,
      finalYDomain
    }
  }

  const initialTimeDomainPoint =  (moment(_.get(dataToPlot, '[0].x')).subtract(10, 'minutes')).valueOf()

  const finalTimeDomainPoint =
    (moment(_.get(dataToPlot, `[${dataToPlot.length - 1}].x`)).add(10, 'minutes')).valueOf()

  const adjustedTicks = _.compact(_.map(ticks, (tick) => 
    tick > initialTimeDomainPoint && tick < finalTimeDomainPoint ? tick : null))
  
  const {
    initialYDomain,
    finalYDomain
  } = getYDomainByUnitType()

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={730}
        height={250}
        data={dataToPlot}
        margin={{ top: 5, right: 30, left: 15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          ticks={adjustedTicks}
          dataKey='x' // time
          scale='time'
          type='number'
          domain={[initialTimeDomainPoint, finalTimeDomainPoint]}
          tickFormatter={(t) => moment(t).format('HH:mm')}
        />
        <YAxis
          tickFormatter={(tick) => {
            const unit = MEASURE_TYPES[measureType].unity
            // if (measureType === 'moisture') {
            //   console.log({tick})

            //   return `${normalizedTick}${unit}`
            // }

            return `${tick}${unit}`
          }}
          type='number'
          scale='linear'
          domain={[initialYDomain, finalYDomain]}
          />
        <Tooltip 
          labelFormatter={(test) =>  moment(test).format('HH:mm')}/>
        <Legend formatter={(value: any) => {
          const sensorInfo = _.find(sensors, (sensorInfo) => value === sensorInfo.serialKey)
          return sensorInfo.name || value
        }} />
        <Legend />
        {_.map(lineDataKeys, (key, index) => <Line type='monotone' dataKey={key} stroke={strokes[index]} key={key} />)}
      </LineChart>
    </ResponsiveContainer>
  )
}