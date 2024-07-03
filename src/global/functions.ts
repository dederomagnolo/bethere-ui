import _ from 'lodash'
import moment from 'moment'

export const getDeviceOptionsToSelect = (userDevices: any) => {
  return _.map(userDevices, (device) => {
      return {
        value: device._id,
        label: device.deviceName,
      };
  })
}