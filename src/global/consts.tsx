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
  RESET: {
    COMMAND_NAME_PT: 'Reinicialização',
    CATEGORY_NAME: 'Restart',
    CATEGORY_NAME_PT: 'Sistema',
    OPTIONS: {
      SET: 'RESET'
    }
  },
  SETTINGS: {
    COMMAND_NAME_PT: 'Configuração',
    CATEGORY_NAME: 'System',
    CATEGORY_NAME_PT: 'Sistema',
    OPTIONS: {
      SET: 'SETTINGS'
    }
  }
}

export const MAPPED_COMMANDS: any = _.map(COMMANDS, (command) => {
  const {
      COMMAND_NAME_PT,
      CATEGORY_NAME,
      CATEGORY_NAME_PT,
      OPTIONS
    } = command
  const mappedOptions = _.map(OPTIONS, (option, key: any) => {
    return {
      command: option,
      status: key
    }
  })
  return {
    commandNameTranslated: COMMAND_NAME_PT,
    categoryName: CATEGORY_NAME,
    categoryNameTranslated: CATEGORY_NAME_PT,
    options: mappedOptions
  }
})

export const SENSORS: any = {
  SHT20: {
    params: [
      {
        type: 'humidity',
        translatedTypeName: 'Umidade relativa do ar',
        unity: '%',
        unityName: 'Percentage',
      },
      {
        type: 'temperature',
        translatedTypeName: 'Temperatura',
        unity: '°C',
        unityName: 'Celsius',
      }
    ],
    errorValue: '998.00'
  },
  HD38: {
    params: [
      {
        type: 'moisture',
        translatedTypeName: 'Umidade do solo',
        unity: 'none',
        unityName: 'analogic signal'
      }
    ],
    errorValue: 'nan'
  }
}
