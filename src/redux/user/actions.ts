type UserInfoProps = { 
  token: string
  userId: string
  authenticated: boolean
  firstName: string
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