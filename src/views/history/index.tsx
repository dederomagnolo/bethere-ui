import React from 'react';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


const dataTo = [
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
  { x: 'MP0', y: '2023-04-11T21:47:01.024Z' },
  { x: 'MP1', y: '2023-04-11T23:53:47.154Z' },
  { x: 'MP0', y: '2023-04-11T17:53:47.154Z' },
  { x: 'MP0', y: '2023-04-11T19:53:47.154Z' },
  { x: 'MP1', y: '2023-04-11T20:53:47.154Z' },
  { x: 'MP1', y: '2023-04-11T21:53:47.154Z' }
];

const ScatterGraph = () => {
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
        <XAxis allowDuplicatedCategory={false} type='category' dataKey="x" name="command"  />
        <YAxis  type="category" dataKey="y" name="time" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="A school" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}


export const History = () => {
  return(
    <div>
      <h1>History</h1>
      <ScatterGraph />
    </div>
  )
}