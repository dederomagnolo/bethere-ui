import _ from 'lodash'

export const WsReadyState = {
  UNINSTANTIATED: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}


export const COMMANDS: any = {
  MANUAL_WATERING: {
    CATEGORY_NAME: 'Manual Watering',
    CATEGORY_NAME_PT: 'Irrigação Manual',
    OPTIONS: {
      ON: 'MP1',
      OFF: 'MP0'
    }
  },
  AUTO_WATERING_MODE: {
    CATEGORY_NAME: 'Auto Watering',
    CATEGORY_NAME_PT: 'Irrigação Automática',
    OPTIONS: {
      ON: 'AW1',
      OFF: 'AW0'
    }
  },
  RESET_LOCAL_STATION: {
    CATEGORY_NAME: 'Reset',
    CATEGORY_NAME_PT: 'Reinicialização',
    OPTIONS: {
      SET: 'RESET_ESP'
    }
  }
}

export const MAPPED_COMMANDS: any = _.map(COMMANDS, (command) => {
  const { CATEGORY_NAME, CATEGORY_NAME_PT, OPTIONS } = command
  const mappedOptions = _.map(OPTIONS, (option, key: any) => {
    return {
      command: option,
      status: key
    }
  })
  return {
    categoryName: CATEGORY_NAME,
    categoryNameTranslated: CATEGORY_NAME_PT,
    options: mappedOptions
  }
})