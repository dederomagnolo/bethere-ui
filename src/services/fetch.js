import callApi from './callApi'

export const fetchCommandHistory = async ({
  dayToRetrieveHistory,
  deviceId,
  token
}) => {
  try {
    const res = await callApi({
      method: 'POST',
      service: '/commands/history',
      payload: {
        dayToRetrieveHistory,
        deviceId
      },
      token
    })

    return res.historyForDate
  } catch (error) {
    console.error(error)
  }
}