import { toast } from 'react-toastify'
import callApi from 'services/callApi'

export const fetchUserNotifications = async ({
  token,
  limit,
  page
}: { token: string, limit?: number, page?: number}) => {
  let queryParams = `?limit=${limit}&page=${page}`

  const useQuery = 
    limit !== undefined || page !== undefined ? queryParams : ''
  try {
    const res = await callApi({
      payload: { limit },
      method: 'POST',
      service: `/notification/all${useQuery}`,
      token
    })

    if (res) {
      return res
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      };
    }
  }
}

export const readNotification = async ({ notificationId, token } : any) => {
  try {
    const res = await callApi({
      payload: { notificationId },
      method: 'POST',
      service: '/notification/read',
      token
    })

    if (res) {
      return res.data
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Error: (${err.message})`,
      };
    }
  }
}

export const deleteNotifications = async ({ notificationsToDelete, token } : any) => {
  const callServices = async () => {
    try {
      const res = await callApi({
        payload: { notificationsToDelete },
        method: 'POST',
        service: '/notification/delete',
        token
      })
  
      if (res) {
        return res.data
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: `Error: (${err.message})`,
        }
      }
    }
  }
  
  const response = await toast.promise(
    callServices,
    {
      pending: 'Enviando informações...',
      success: {
        render({ data }){
          // if (error) {
          //   return 'Ocorreu um  erro'
          // }
          return 'Dados salvos com sucesso!'
      }},
      error: 'Ocorreu um erro'
    }
  )

  return response
}