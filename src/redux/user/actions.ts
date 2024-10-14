type UserInfoProps = { 
  token: String
  userId: String
  authenticated: Boolean
}

export const setUserInfo = (payload: UserInfoProps) => {
  return {
    type: 'SET_USER_INFO',
    payload: payload
  }
}

export const clearUserState = () => {
  return {
    type: 'USER_CLEAR_STATE'
  }
}