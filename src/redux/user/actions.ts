export const setToken = (token: String) => {
  return {
    type: 'USER_SET_TOKEN',
    payload: token
  }
}