import callApi from './callApi'

const callService = async({
  loadingCallback,
  apiCall
}) => {
  try {
    loadingCallback(true)
    const res = apiCall()

    if(res) {
      loadingCallback(false)
      return res
    }

    loadingCallback(false)
    return console.error('Não foi possível realizar a chamada')
  } catch (error) {
    loadingCallback(false)
    console.error(error)
  }
}

export const fetchCommandHistory = async ({
  dayToRetrieveHistory,
  deviceId,
  token,
  loadingCallback
}) => {

  const apiCall = async () => await callApi({
    method: 'POST',
    service: '/commands/history',
    payload: {
      dayToRetrieveHistory,
      deviceId
    },
    token
  })

  return callService({
    apiCall,
    loadingCallback,
    deviceId,
    dayToRetrieveHistory
  })
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

  return callService({
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

  return callService({
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

  return callService({
    apiCall,
    loadingCallback
  })
}