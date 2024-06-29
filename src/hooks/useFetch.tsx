import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setGlobalError } from 'redux/global/actions'

export const useFetch = (fetchService: Function, dependencies: any[] = []) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState({}) as any
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const callService = async () => {
      setLoading(true)
      try {
        const res = await fetchService()
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
    }
    callService()
  }, [...dependencies])

  return {
    data, loading, error
  }
}