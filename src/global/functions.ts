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
  valueToIncrement,
  momentType,
  date
} : any) => {
  const dateToManipulate = moment(date).startOf('day');
  const tickTimeStrings = []
  let numberOfTicks = 0

  if (momentType === 'minutes') {
    numberOfTicks = (24 * 60) / valueToIncrement  
  }

  if (momentType === 'hours') {
    numberOfTicks = 24 / valueToIncrement
  }

  tickTimeStrings.push(moment(date).format())

  for (let i = 0; i < numberOfTicks; i++) {
    tickTimeStrings.push(dateToManipulate.add(valueToIncrement, momentType).format())
  }

  console.log({ tickTimeStrings })

  const tickNumericValues = tickTimeStrings.map(timeString => moment(timeString).valueOf());

  return tickNumericValues
}