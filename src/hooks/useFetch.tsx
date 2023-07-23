import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setGlobalError } from 'redux/global/actions'

export const useFetch = (fetchService: Function, dependencies: any[] = []) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const callService = async () => {
      setLoading(true)
      try {
        const res = await fetchService()
        if (res) {
          if(res.status === 200) {
            return setData(res)
          }

          if (res.status === 401) {
            return navigate('/login')
          }

          setError(true)
          dispatch(setGlobalError({ service: res.service, message: res.message, status: res.status }))
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