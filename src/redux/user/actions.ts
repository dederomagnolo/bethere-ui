export const setToken = (token: String) => {
  return {
    type: 'USER_SET_TOKEN',
    payload: token
  }
}

export const clearUserState = () => {
  return {
    type: 'USER_CLEAR_STATE'
  }
}