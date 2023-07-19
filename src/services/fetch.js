import callApi from './callApi'
import { editSettings } from './settings'
import { sendCommandToServer } from './commands'

export const tryToCallService = async({
  loadingCallback,
  apiCall
}) => {
  const setLoading = () => loadingCallback && loadingCallback(true)
  const removeLoading = () => loadingCallback && loadingCallback(false)
  try {
    setLoading()
    const res = apiCall()

    if(res) {
      removeLoading()
      return res
    }

    removeLoading()
    return console.error('Não foi possível realizar a chamada')
  } catch (error) {
    removeLoading()
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

  console.log({
    res
  })
  return res
}

export const fetchUserDevices = async ({
  loadingCallback,
  token
}) => {
  const apiCall = async () => await callApi({
    method: 'GET',
    service: '/devices/user',
    token
  })

  return tryToCallService({
    apiCall,
    loadingCallback
  })
}

export const editDeviceName = async ({
  loadingCallback,
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
    apiCall,
    loadingCallback
  })
}

export const getMeasuresHistory = async ({
  loadingCallback,
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
    apiCall,
    loadingCallback
  })
}

export const editSettingsAndSendCommand = async ({
  loadingCallback,
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