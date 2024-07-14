import callApi from 'services/callApi'

export const fetchAllUserCommands = async ({
  dayToRetrieveHistory,
  token
}: any) => {
  const res = await callApi({
    method: 'POST',
    service: '/commands/all',
    payload: {
      dayToRetrieveHistory,
    },
    token
  })

  return res
}