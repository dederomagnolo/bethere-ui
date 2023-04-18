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

const mock = [
  {
    "_id": "6435d555f0786a0224de6770",
    "commandName": "MP0",
    "categoryName": "Manual Watering",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:47:01.024Z",
    "__v": 0
  },
  {
    "_id": "6435d559f0786a0224de6774",
    "commandName": "MP1",
    "categoryName": "Manual Watering",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:47:05.478Z",
    "__v": 0
  },
  {
    "_id": "6435d55cf0786a0224de6778",
    "commandName": "MP0",
    "categoryName": "Manual Watering",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:47:08.297Z",
    "__v": 0
  },
  {
    "_id": "6435d566f0786a0224de677c",
    "commandName": "MP1",
    "categoryName": "Manual Watering",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:47:18.687Z",
    "__v": 0
  },
  {
    "_id": "6435d6c4e6b4410e2d27f3cf",
    "commandName": "RESET_ESP",
    "categoryName": "Reset",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:53:08.161Z",
    "__v": 0
  },
  {
    "_id": "6435d6ebe6b4410e2d27f3d3",
    "commandName": "WR_ON",
    "categoryName": "Watering Routine Mode",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:53:47.154Z",
    "__v": 0
  },
  {
    "_id": "6435d6f8e6b4410e2d27f3d7",
    "commandName": "WR_OFF",
    "categoryName": "Watering Routine Mode",
    "deviceId": "643588648de6aa7937d36253",
    "userId": "6435854dd1055c05fbc22776",
    "changedFrom": "App",
    "createdAt": "2023-04-11T21:54:00.253Z",
    "__v": 0
  }
]

const data = [
  { x: 'MP1', y: '2023-04-17T05:53:47.154Z' },
  { x: 'MP1', y: '2023-04-17T12:19:47.154Z' },
  { x: 'MP0', y: '2023-04-17T13:12:47.112Z' },
  { x: 'MP0', y: '2023-04-17T19:35:47.132Z' },
  { x: 'MP0', y: '2023-04-17T23:47:01.024Z' },
];

const tickTimeStrings = []
const startDate = moment().startOf('day')

const startDateToQuery = moment(startDate).utc().format()

// console.log({startDateToQuery})

tickTimeStrings.push(startDate.format())

for (let i = 0; i < 3; i++) {
  tickTimeStrings.push(startDate.add(6, 'hours').format())
}

const formattedData = data.map(row => ({
  x: row.x,
  y: (moment(row.y)).valueOf()
}))

const tickNumericValues = tickTimeStrings.map(timeString => moment(timeString).valueOf());

// console.log({ tickNumericValues, formattedData })

const colors = { MP0: '#8884d8', MP1: '#378d32'} as any

export const CustomScatterChart = () => {
  const generateScatterComponents = () => {
    const dataPerCommand = _.groupBy(formattedData, (item) => item.x)
    return _.map(dataPerCommand, (commandData, index) => {
      return <Scatter key={index} name={`Comando ${index}`} data={commandData} fill={colors[index]} />
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