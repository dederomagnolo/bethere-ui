
import callApi from '../callApi'

type FetchAlertsProps = { 
  token: string,
  deviceId: string
}

type CreateAlertProps = FetchAlertsProps & {
  sensorId: string,
  alertName: string,
  paramName: string,
  value: string,
  operator: number
}

type DeleteAlertProps = FetchAlertsProps & {
  sensorId: string
  alertId: string
}

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
  paramName,
  value,
  operator
}: CreateAlertProps) => {
  try {
    const res = await callApi({
      payload: {
        deviceId,
        sensorId,
        alertName,
        paramName,
        value,
        operator
      },
      method: 'POST',
      service: '/alerts/create',
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

export const editAlert = async ({
  token,
  deviceId,
  sensorId,
  alertName,
  paramName,
  value,
  operator
}: CreateAlertProps) => {
  try {
    const res = await callApi({
      payload: {
        deviceId,
        sensorId,
        alertName,
        paramName,
        value,
        operator
      },
      method: 'POST',
      service: '/alerts/edit',
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