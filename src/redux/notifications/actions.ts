import { Notification } from 'types/interfaces'

export const setNotifications = (notifications: Notification[]) => {
  return {
    type: 'SET_NOTIFICATIONS',
    payload: notifications
  }
}