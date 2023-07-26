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

export const checkToken = async (token) => {
  return await callApi({
    token,
    method: 'POST',
    service: '/user/check'
  })
}