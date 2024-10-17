import callApi from 'services/callApi'
import CallService from 'services/service'

interface WriteCommandProps {
  token: string
  payload: {
    commandCode: string
    changedFrom: string
    userId: string
    deviceId: string
  }
}

export const getStatusFromLocalStation = async () => {
  try {
    const res = CallService.get({
      service: '/local-station/status'
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