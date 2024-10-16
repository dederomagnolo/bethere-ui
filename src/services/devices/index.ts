import callApi from 'services/callApi'

export const fetchUserDevices = async ({ token }: { token: string }) => {
  try {
    const res = await callApi({
      method: 'GET',
      service: '/devices/user',
      token
    })

    return res
  } catch (err) {
    return err
  }
}