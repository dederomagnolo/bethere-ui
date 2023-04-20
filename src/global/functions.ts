import _ from 'lodash'
import moment from 'moment'

export const getDeviceOptionsToSelect = (userDevices: any) => {
  return _.map(userDevices, (device) => {
      return {
        value: device._id,
        label: device.deviceName,
      };
  })
};

export const generateTicks = ({ 
  valueToIncrement, momentType
} : any) => {

  const tickTimeStrings = []
  const startDate = moment('2023-04-18T21:00:00Z').startOf('day')
  tickTimeStrings.push(startDate.format())

  for (let i = 0; i < 48; i++) {
    tickTimeStrings.push(startDate.add(valueToIncrement, momentType).format())
  }

  console.log({ tickTimeStrings })

  const tickNumericValues = tickTimeStrings.map(timeString => moment(timeString).valueOf());

  return tickNumericValues
}

export const mapMeasureBatchToChartData = (data: any) => {
  const mappedBatches = [] as any

  _.forEach(data, (batch, key) => {
    const mappedBatch = _.map(batch, (batchItem) => {
      return {
        [key]: batchItem.value,
        createdAt: batchItem.createdAt
      }
    })
    mappedBatches.push(mappedBatch)
  })
  
  const merged = _.merge(mappedBatches[0], mappedBatches[1])

  return merged
}