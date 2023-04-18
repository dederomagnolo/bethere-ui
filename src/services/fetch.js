import callApi from './callApi'

export const fetchCommandHistory = async ({
  dayToRetrieveHistory,
  deviceId,
  token,
  loadingCallback
}) => {
  try {
    loadingCallback(true)
    const res = await callApi({
      method: 'POST',
      service: '/commands/history',
      payload: {
        dayToRetrieveHistory,
        deviceId
      },
      token
    })

    if(res) {
      loadingCallback(false)
      return res.historyForDate
    }
  } catch (error) {
    loadingCallback(false)
    console.error(error)
  }
}