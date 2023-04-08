export const setUserInfo = ({ token, userId}: { token: String, userId: String }) => {
  return {
    type: 'SET_USER_INFO',
    payload: { token, userId }
  }
}

export const clearUserState = () => {
  return {
    type: 'USER_CLEAR_STATE'
  }
}