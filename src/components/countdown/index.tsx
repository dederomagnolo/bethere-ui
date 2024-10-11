import { useEffect, useState } from 'react'

const millisToMinutesAndSeconds = (millis : number | undefined) => {
  if (!millis) return { minutes: 0, seconds: `00`}
  const minutes = Math.floor((millis % 36e5) / 6e4)
  const seconds = Math.floor((millis % 6e4) / 1000)

  console.log({ minutes, seconds, conta: (millis % 36e5) / 6e4 })

  return ({
    minutes,
    seconds: seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0)
  })
}

export const Countdown = ({ initialState }: { initialState: number | undefined }) => {
  const [countdown, setCountdown] = useState(initialState) // in ms

  useEffect(() => {
    console.log( 'caiu aqui' )

    if (initialState !== undefined) {
      console.log('começou')
      const timerInterval = setInterval(() => {
        setCountdown((prevTime: any) => {
          console.log({ prevTime })
          if (prevTime === undefined || Number.isNaN(prevTime)) {
            setCountdown(initialState)
          }

          if (prevTime === 0) {
            clearInterval(timerInterval)
            return 0
          } else {
            return prevTime - 1000
          }
        })
      }, 1000)
      return () => {
        console.log('limpou')
        clearInterval(timerInterval)
      }
    }
  }, [initialState])

  const {
    minutes,
    seconds
  } = millisToMinutesAndSeconds(countdown)

  return (
    <div>{minutes}:{seconds}</div>
  )
}