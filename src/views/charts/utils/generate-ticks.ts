import moment from 'moment'

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

  const tickNumericValues = tickTimeStrings.map(timeString => moment(timeString).valueOf());

  return tickNumericValues
}
