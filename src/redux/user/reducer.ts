import _ from 'lodash'

interface UserState {
  token: String
  username: String,
  userId: String,
}

const initialState = {
  token: '',
  username: '',
  userId: ''
}


export const UserReducer = (
  state: UserState = initialState, 
  action: any
) => {
    switch(action.type) {
      case('SET_USER_INFO'):
        return {
          ...state,
          ...action.payload
        }
      case('USER_CLEAR_STATE'):
        return {
          ...initialState
        }
      case "persist/REHYDRATE": {
        return {
          ...state,
          ..._.get(action.payload, 'user')
        }
      }
      default:
        return state
    }
}