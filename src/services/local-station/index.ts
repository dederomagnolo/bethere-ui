import callApi from 'services/callApi'

interface WriteCommandProps {
  token: string
  payload: {
    commandCode: string
    changedFrom: string
    userId: string
    deviceId: string
  }
}

export const getStatusFromLocalStation = async ({ token }: { token: string }) => {
  try {
    const res = await callApi({
      method: 'GET',
      service: '/local-station/status',
      token
    })
  
    return res
  } catch (err) {
    throw(err)
  }
}

export const writeCommand = async({ token, payload }: WriteCommandProps) => {
  const res = await callApi({ // TODO: add this to services
    token,
    method: 'POST',
    service: '/local-station/command',
    payload
  })

  return res
}