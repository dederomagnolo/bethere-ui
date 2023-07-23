import _ from 'lodash'
import { GlobalState } from './interface'

const initialState = {
  error: {
    message: '',
    service: '',
    status: null
  },
  loading: false
}

export const GlobalReducer = (
  state: GlobalState = initialState, 
  action: any
) => {
    switch(action.type) {
      case('SET_GLOBAL_ERROR'):
        return {
          ...state,
          error: {
            ...state.error,
            ...action.payload
          }
        }
      case('SET_GLOBAL_LOADING'):
        return {
          ...state,
          ...action.payload
        }
      case('GLOBAL_CLEAR_STATE'):
        return {
          ...initialState
        }
      // case 'persist/REHYDRATE': {
      //   return {
      //     ...state,
      //     ..._.get(action.payload, 'global')
      //   }
      // }
      default:
        return state
    }
}