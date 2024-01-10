import { toast } from "react-toastify"

import callApi from './callApi'
import { editSettings } from './settings'
import { sendCommandToServer } from './commands'

export const tryToCallService = async({
  apiCall
}) => {

  try {
    const res = apiCall()

    if(res) {
      return res
    }

    return console.error('Não foi possível realizar a chamada')
  } catch (error) {
    console.error(error)
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
    console.error(error)
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
  const { deviceId, settingsId } = settingsPayload

  const callServices = async () => {
    try {
      const editRes = await editSettings({
        token,
        settingsPayload
      })
    
      const sendCommandRes = await sendCommandToServer({
        token,
        commandName: 'SETTINGS',
        commandPayload: {
          settingsId
        },
        deviceId
      })
    
      const updatedDevices = await fetchUserDevices({
        token
      })
  
      return updatedDevices
    } catch (err) {
      console.log('aqui')
      return err
    }
  }
  
  const response = await toast.promise(
    callServices,
    {
      pending: 'Enviando informações...',
      success: 'Dados salvos com sucesso.',
      error: (err) => {
        console.log(err)
        return 'Ocorreu um erro'
      } 
    }
  )

  //  need to improve this call
  console.log({ response })
  return response
}

export const checkToken = async (token) => {
  return await callApi({
    token,
    method: 'POST',
    service: '/user/check'
  })
}