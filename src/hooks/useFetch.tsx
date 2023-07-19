import { useEffect, useState } from 'react'

export const useFetch = (fetchService: Function) => {
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
  }, [])

  return {
    data, loading, error
  }
}