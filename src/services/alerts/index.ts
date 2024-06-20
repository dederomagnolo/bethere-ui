
import callApi from '../callApi'
import { FetchAlertsProps, CreateAlertProps, EditAlertProps, DeleteAlertProps } from './types'

export const fetchAlerts = async ({
  token,
  deviceId
}: FetchAlertsProps) => {
  try {
    const res = await callApi({
      payload: {
        deviceId
      },
      method: 'POST',
      service: '/alerts/all',
      token
    })

    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      };
    }
  }
}

export const createAlert = async ({
  token,
  deviceId,
  sensorId,
  alertName,
  paramType,
  value,
  operator,
}: CreateAlertProps) => {
  try {
    const res = await callApi({
      payload: {
        deviceId,
        sensorId,
        alertName,
        paramType,
        value,
        operator
      },
      method: 'POST',
      service: '/alerts/create',
      token,
      showToast: true
    })

    return res
  } catch (err: unknown) {
    throw new Error('400');
  }
}

export const editAlert = async ({
  token,
  deviceId,
  sensorId,
  alertName,
  paramType,
  value,
  alertId,
  operator
}: EditAlertProps) => {
  try {
    const res = await callApi({
      payload: {
        deviceId,
        sensorId,
        alertName,
        paramType,
        value,
        operator,
        alertId
      },
      method: 'POST',
      service: '/alerts/edit',
      token,
      showToast: true
    })

    return res
  } catch (err: unknown) {
    // if (err instanceof Error) {
    //   return {
    //     message: `Error: (${err.message})`,
    //   };
    // }
    throw new Error('400');
  }
}

export const deleteAlert = async ({
  token,
  deviceId,
  sensorId,
  alertId
}: DeleteAlertProps) => {
  try {
    const res = await callApi({
      payload: {
        deviceId,
        sensorId,
        alertId
      },
      method: 'POST',
      service: '/alerts/delete',
      token,
      showToast: true
    })

    return res
  } catch (err: unknown) {
    throw new Error('400');
  }
}