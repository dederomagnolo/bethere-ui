import _ from 'lodash'

export const getUserDevices = (state: any) => {
  return state.devices.userDevices
}

export const getDefaultDeviceId = (state: any) => {
  const defaultDevice = _.find(state.devices.userDevices, (device) => device.defaultDevice)
  return _.get(defaultDevice, '_id')
}