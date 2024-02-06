import { tryToCallService } from '../fetch'
import callApi from 'services/callApi'

interface EditSettingsArgs {
  settingsPayload: any,
  token: String,
}

export const editSettings = async ({
  token,
  settingsPayload
} : EditSettingsArgs) => {
  try {
    const apiCall = async () => await callApi({
      method: 'POST',
      service: '/settings/edit',
      payload: settingsPayload,
      token
    })
  
    return await tryToCallService({
      apiCall
    })
  } catch(err: any) {
    throw new Error(err)
  }
}
