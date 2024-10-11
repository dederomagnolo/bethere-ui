import { Loading } from 'components/ui-atoms'
import { useEffect, useState } from 'react'

const millisToMinutesAndSeconds = (millis : number | undefined) => {
  if (!millis) return { minutes: 0, seconds: `00`}
  const minutes = Math.floor((millis % 36e5) / 6e4)
  const seconds = Math.floor((millis % 6e4) / 1000)

  return ({
    minutes,
    seconds: seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0)
  })
}

export const Countdown = ({ initialState }: { initialState: number | undefined }) => {
  const [countdown, setCountdown] = useState(initialState) // in ms
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    if (initialState !== undefined) {
      const timerInterval = setInterval(() => {
        setCountdown((prevTime: any) => {
          if (prevTime === undefined || Number.isNaN(prevTime)) {
            setCountdown(initialState)
            return initialState
          }

          setLoading(false)

          if (prevTime === 0) {
            clearInterval(timerInterval)
            return 0
          } else {
            return prevTime - 1000
          }
        })
      }, 1000)
      return () => {
        clearInterval(timerInterval)
      }
    }
  }, [initialState])

  const {
    minutes,
    seconds
  } = millisToMinutesAndSeconds(countdown)

  return (
    loading ? <Loading size={10}/> : <div>{minutes}:{seconds}</div>
  )
}