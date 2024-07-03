import _ from 'lodash'

export const getUserDevices = (state: any) => {
  return state.devices.userDevices
}

export const getDefaultDeviceId = (state: any) => {
  const defaultDevice = _.find(state.devices.userDevices, (device) => device.defaultDevice)
  return _.get(defaultDevice, '_id')
}

export const getDefaultDeviceData = (state: any) => {
  return _.find(state.devices.userDevices, (device) => device.defaultDevice)
}

export const getUserSensors = (state: any) => {
  const userDevices = state.devices.userDevices

  const userSensorsByDevice = _.map(userDevices, (device) => device.sensors)
  return _.flatten(userSensorsByDevice)
}