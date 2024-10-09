
import { Automation } from 'types/interfaces'
import callApi from '../callApi'
import { CreateAutomationProgram, FetchAutomationRoutinesProps } from './types'

export const fetchAutomationRoutines = async ({
  token
}: FetchAutomationRoutinesProps) => {
  try {
    const res = await callApi({
      method: 'GET',
      service: '/automation/all',
      token
    })

    return res
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      };
    }
  }
}

export const createAutomationProgram = async ({
  token,
  name,
  type,
  timer,
  trigger
}: CreateAutomationProgram) => {
  try {
    const res = await callApi({
      payload: {
        name,
        type,
        timer,
        trigger
      },
      method: 'POST',
      service: '/automation/create',
      token,
      showToast: true
    })

    return res
  } catch (err: unknown) {
    throw new Error('400');
  }
}
