import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setGlobalError } from 'redux/global/actions'
import { getToken } from 'redux/user/selectors'

export const useCallApi = (fetchService: Function, dependencies: any[] = [], serviceProps?: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(getToken)
  const [data, setData] = useState({}) as any
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [callService, setCallService] = useState<any>(null)

  useEffect(() => {
    setCallService(
      async () => {
        setLoading(true)
        try {
          const res = await fetchService({ token, ...serviceProps })
          if (res) {            
            if (res.error) {
              if (res.status === 401) {
                return navigate('/login')
              }
              setError(true)
              return dispatch(setGlobalError({ service: res.service, message: res.message, status: res.status }))
            }
            //success 
            setData(res)
          }
          
          setLoading(false)
        } catch (err: any) {
          console.error(err)
          dispatch(setGlobalError({ message: err, service: '' }))
          setLoading(false)
          setError(true)
        }

        return { data, error, loading }
      }
    )
    
  }, [...dependencies])

  return callService
}