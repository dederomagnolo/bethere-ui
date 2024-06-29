import callApi from 'services/callApi'

export const getStatusFromLocalStation = async ({ token }: { token: string }) => {
  const res = await callApi({
    method: 'GET',
    service: '/local-station/status',
    token
  })

  return res
}