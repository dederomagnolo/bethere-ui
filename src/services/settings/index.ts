import { tryToCallService } from '../fetch'
import callApi from 'services/callApi'

interface EditSettingsArgs {
  settingsPayload: any,
  token: String,
  loadingCallback?: Function
}

export const editSettings = async ({
  loadingCallback,
  token,
  settingsPayload
} : EditSettingsArgs) => {
  const apiCall = async () => callApi({
    method: 'POST',
    service: '/settings/edit',
    payload: settingsPayload,
    token
  })

  return tryToCallService({
    apiCall,
    loadingCallback
  })
}
