import _ from 'lodash'
import { MAPPED_COMMANDS } from 'global/consts'
import callApi from 'services/callApi'
import { tryToCallService } from 'services/fetch'


interface SendCommandToServerArgs {
  loadingCallback: Function,
  token: string,
  commandName: string,
  commandPayload?: {
    settingsId?: string
  },
  deviceId: string
}

const findCategoryForCommand = (commandName: string) => {
  let commandCategory
  _.forEach(MAPPED_COMMANDS, (category, index) => {
    const categoryOptions = _.get(category, 'options')
    console.log({categoryOptions})
    const isCommandOnCategoryOptions = _.find(categoryOptions, (option) => option.command === commandName)
    if (isCommandOnCategoryOptions) {
      commandCategory = MAPPED_COMMANDS[index].categoryName
    }
    return
  })
  return commandCategory
}

export const sendCommandToServer = async ({
  loadingCallback,
  token,
  commandName,
  commandPayload,
  deviceId
}: SendCommandToServerArgs) => {
  const categoryName = findCategoryForCommand('MP0')

  const apiCall = async () => callApi({
    method: 'POST',
    service: '/local-station/command',
    token,
    payload: {
      commandName,
      commandPayload,
      categoryName,
      deviceId,
      changedFrom: 'APP'
    },
  })

  return (
    tryToCallService({
      apiCall,
      loadingCallback
    })
  )
}