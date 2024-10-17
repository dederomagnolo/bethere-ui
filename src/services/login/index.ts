import CallService from '../service'

const authenticate = async ({ username, password }: any) => {
  try {
    const res = await CallService.post({
      payload: { username, password },
      service: '/user/authenticate'
    })

    if (res) {
      const token = res.token
      CallService.setToken(token)
    }
  } catch (err) {
    console.error(err)
  }
}

const LoginService = {
  authenticate
}

export default LoginService