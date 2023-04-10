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
    OPTIONS: {
      ON: 'MP1',
      OFF: 'MP0'
    }
  }
}