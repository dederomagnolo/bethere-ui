import { ErrorProps } from './interface'

export const setGlobalError = (payload: ErrorProps) => {
  return {
    type: 'SET_GLOBAL_ERROR',
    payload
  }
}
