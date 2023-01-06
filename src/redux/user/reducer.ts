import { PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  token: String
  username: String
}

const initialState = {
  token: '',
  username: ''
}


export const UserReducer = (
  state: UserState = initialState, 
  action: any
) => {
    switch(action.type) {
      case('USER_SET_TOKEN'):
        return {
          ...state,
          token: action.payload
        }
      case('USER_CLEAR_STATE'):
        return {
          ...initialState
        }
      default:
        return state
    }
}