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
  const apiCall = async () => await callApi({
    method: 'GET',
    service: '/devices/user',
    token
  })

  return tryToCallService({
    apiCall
  })
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

  await editSettings({
    token,
    settingsPayload
  })

  await sendCommandToServer({
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

  //  need to improve this call

  return updatedDevices
}