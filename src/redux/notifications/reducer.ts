import _ from 'lodash'
import { Notification } from 'types/interfaces'
const initialState = {
  notifications: []
}

export const NotificationsReducer = (
  state: any, 
  action: any
) => {
  switch (action.type) {
    case('SET_NOTIFICATIONS'):
      return { ...state, notifications: action.payload }
    case('CLEAR_NOTIFICATIONS_STATE'):
      return { ...initialState }
    default:
      return initialState
  }
}