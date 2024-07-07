import _ from 'lodash'
import { MAPPED_COMMANDS } from 'global/consts'
import callApi from 'services/callApi'
import { tryToCallService } from 'services/fetch'


interface SendCommandToServerArgs {
  token: string,
  commandCode: string,
  commandPayload?: {
    settingsId?: string
  },
  deviceId: string
}

export const sendCommandToServer = async ({
  token,
  commandCode,
  commandPayload,
  deviceId
}: SendCommandToServerArgs) => {
  const apiCall = async () => callApi({
    method: 'POST',
    service: '/local-station/command',
    token,
    payload: {
      commandCode,
      commandPayload,
      deviceId,
      changedFrom: 'APP'
    },
  })

  return (
    tryToCallService({
      apiCall
    })
  )
}