import { ErrorProps } from './interface'

export const setGlobalError = (payload: ErrorProps) => {
  return {
    type: 'SET_GLOBAL_ERROR',
    payload
  }
}

export const clearGlobalState = () => {
  return {
    type: 'GLOBAL_CLEAR_STATE'
  }
}
