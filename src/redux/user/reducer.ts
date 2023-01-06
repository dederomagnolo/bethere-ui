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
      default:
        return state
    }
}