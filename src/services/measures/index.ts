import callApi from '../callApi'

export const getMeasuresHistory = async ({
  token,
  deviceId,
  dayToRetrieveHistory
}: any) => { // TODO: typing
  try {
    const res = await callApi({
      method: 'POST',
      service: '/measures/history',
      payload: {
        deviceId,
        dayToRetrieveHistory
      },
      token
    })

    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      }
    }
  }
}

export const getAllUserMeasures = async ({
  token,
  dayToRetrieveHistory
}: any) => {
  try {
    const res = await callApi({
      method: 'POST',
      service: '/measures/all',
      payload: {
        dayToRetrieveHistory
      },
      token
    })

    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      }
    }
  }
}