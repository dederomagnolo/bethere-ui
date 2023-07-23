import { useEffect, useState } from 'react'

export const useFetch = (fetchService: Function, dependencies: any[] = []) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const callService = async () => {
      setLoading(true)
      try {
        const res = await fetchService()
        setData(res)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
        setError('Fetch error')
      }
    }
    callService()
  }, [...dependencies])

  return {
    data, loading, error
  }
}