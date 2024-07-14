
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';

import _ from 'lodash'
import moment from 'moment'
import { MEASURE_TYPES, NEW_COMMANDS } from 'global/consts'

import { generateTicks } from '../utils'
import { useState } from 'react';

const strokes = ["#82ca9d", "#8884d8", "#8884d8"] as any

export const CustomLineChart = ({
  dataToPlot,
  lineDataKeys = ['nop', 'nop'],
  dateToAjdustTicks,
  measureType,
  sensors,
  secondBatch
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

  const [xDomain, setXDomain] = useState({
    initial: (moment(_.get(dataToPlot, '[0].x')).subtract(10, 'minutes')).valueOf(),
    final: (moment(_.get(dataToPlot, `[${dataToPlot.length - 1}].x`)).add(10, 'minutes')).valueOf()
  })   

  const adjustedTicks = _.compact(_.map(ticks, (tick) => 
    tick > xDomain.initial && tick < xDomain.final ? tick : null))
  
  const {
    initialYDomain,
    finalYDomain
  } = getYDomainByUnitType()

  const handleAxisAdjustment = ({ startIndex, endIndex }: any) => {
    const updatedDomain = {
      initial: (moment(_.get(dataToPlot, `[${startIndex}].x`)).subtract(10, 'minutes')).valueOf(),
      final: (moment(_.get(dataToPlot, `[${endIndex}].x`)).add(10, 'minutes')).valueOf()
    }

    return setXDomain(updatedDomain)
  }

  const renderReferenceLines = () => {

    return _.map(secondBatch, (p) => {
      const commandCode = p.c

      const isOnCommand =
        commandCode === NEW_COMMANDS.AUTO_WATERING_ON.CODE ||
        commandCode === NEW_COMMANDS.MANUAL_WATERING_ON.CODE

      const labels = {
        [NEW_COMMANDS.AUTO_WATERING_ON.CODE]: 'Auto ON',
        [NEW_COMMANDS.AUTO_WATERING_OFF.CODE]: 'Auto OFF',
        [NEW_COMMANDS.MANUAL_WATERING_ON.CODE]: 'Manual ON',
        [NEW_COMMANDS.MANUAL_WATERING_OFF.CODE]: 'Manual OFF'
      }

      return (
        <ReferenceLine
          x={p.x} strokeDasharray="3 3"
          stroke={isOnCommand ? 'green' : 'red'}
          label={labels[commandCode]} />)
    })
    
  }

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
          scale='linear'
          type='number'
          domain={[xDomain.initial, xDomain.final]}
          tickFormatter={(t) => moment(t).format('HH:mm')}
        />
        <YAxis
          tickFormatter={(tick) => {
            const unit = MEASURE_TYPES[measureType].unity
            return `${tick}${unit}`
          }}
          type='number'
          scale='linear'
          domain={[initialYDomain, finalYDomain]} />
        <Tooltip 
          labelFormatter={(test) =>  moment(test).format('HH:mm')}/>
        <Legend
          wrapperStyle={{ top: -8  }}
          verticalAlign="top"
          formatter={(value: any) => {
          const sensorInfo = _.find(sensors, (sensorInfo) => value === sensorInfo.serialKey)
          return sensorInfo.name || value
        }} />
        {/* {renderReferenceLines()} */}
        {_.map(lineDataKeys, (key, index) =>
          <Line type='monotone' dataKey={key} stroke={strokes[index]} key={key} />)}
        <Brush height={30} onChange={handleAxisAdjustment} />
      </LineChart>
    </ResponsiveContainer>
  )
}