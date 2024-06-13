import { toast } from "react-toastify"

import callApi from './callApi'
import { editSettings } from './settings'
import { sendCommandToServer } from './commands'

export const tryToCallService = async({
  apiCall
}) => {
  try {
    const res = await apiCall()

    if (res) {
      return res
    }
  } catch (err) {
    throw new Error(err) // need to handle this on UI too
  }
}

export const fetchCommandHistory = async ({
  dayToRetrieveHistory,
  deviceId,
  token
}) => {
  const res = await callApi({
    method: 'POST',
    service: '/commands/history',
    payload: {
      dayToRetrieveHistory,
      deviceId
    },
    token
  })

  return res
}

export const fetchUserDevices = async ({
  token
}) => {
  try {
    return await callApi({
      method: 'GET',
      service: '/devices/user',
      token
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const editDeviceName = async ({
  token,
  deviceId,
  deviceName
}) => {
  const apiCall = async () => callApi({
    method: 'POST',
    service: '/devices/edit',
    payload: {
      deviceId,
      deviceName
    },
    token
  })

  return tryToCallService({
    apiCall
  })
}

export const editSensorName = async ({
  token,
  sensorId,
  sensorName
}) => {
  const apiCall = async () => callApi({
    method: 'POST',
    service: '/sensors/edit',
    payload: {
      sensorId,
      sensorName
    },
    token
  })

  return tryToCallService({ apiCall })
}

export const setDefaultDevice = async ({ deviceId, token }) => {
  try {
    const res = await callApi({
      method: 'POST',
      service: '/devices/set-default',
      payload: { deviceId },
      token
    })

    return res
  } catch (err) {
    console.error(err)
  }
}

export const getMeasuresHistory = async ({
  token,
  deviceId,
  dayToRetrieveHistory
}) => {
  const apiCall = async () => callApi({
    method: 'POST',
    service: '/measures/history',
    payload: {
      deviceId,
      dayToRetrieveHistory
    },
    token
  })

  return tryToCallService({
    apiCall
  })
}

export const editSettingsAndSendCommand = async ({
  token,
  settingsPayload
}) => {
  const callServices = async () => {
    try {
      await editSettings({
        token,
        settingsPayload
      })
    
      const updatedDevices = await fetchUserDevices({
        token
      })
  
      return updatedDevices
    } catch (err) {
      throw new Error(err)
    }
  }
  
  const response = await toast.promise(
    callServices,
    {
      pending: 'Enviando informações...',
      success: {
        render({ data }){
          console.log()
          // if (error) {
          //   return 'Ocorreu um  erro'
          // }
          return 'Dados salvos com sucesso!'
      }},
      error: ({ data }) => {
        console.log(data)
        return 'Ocorreu um erro'
      } 
    }
  )

  //  need to improve this call
  return response
}

export const checkToken = async (token) => {
  try {
    const res = await callApi({
      token,
      method: 'POST',
      service: '/user/check'
    })

    return res
  } catch (err) {
    return err
  }
}

export const fetchAlerts = async ({
  token,
  deviceId
}) => {
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
  } catch (error) {
    throw new Error(error)
  }
}

export const createAlert = async ({
  token,
  deviceId,
  sensorId,
  alertName,
  paramName,
  value
}) => {
  try {
    const res = await callApi({
      payload: {
        deviceId,
        sensorId,
        alertName,
        paramName,
        value
      },
      method: 'POST',
      service: '/alerts/create',
      token
    })

    return res
  } catch (error) {
    throw new Error(error)
  }
}