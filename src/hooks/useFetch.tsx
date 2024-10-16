import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setGlobalError } from 'redux/global/actions'
import { getToken } from 'redux/user/selectors'
import { clearUserState } from 'redux/user/actions'

export const useFetch = (fetchService: Function, dependencies: any[] = [], serviceProps?: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(getToken)
  const [data, setData] = useState({}) as any // TODO: SHOULD BE UNDEFINED. EACH COMPONENT COULD INITIALIZE IT AS IT IS NEEDED ISTEAD OF ALWAYS CALL IS EMPTY
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const callService = async () => {
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

        if (err.status === 401) {
          dispatch(setGlobalError({ message: err, service: '' }))
          dispatch(clearUserState())
        }

        dispatch(setGlobalError({ message: err, service: '' }))
        setLoading(false)
        setError(true)
      }
    }

    callService()
  }, [...dependencies])

  return {
    data, loading, error
  }
}