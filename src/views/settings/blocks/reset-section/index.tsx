import { useSelector } from 'react-redux'

import { Button, Loading } from 'components'

import { sendCommandToServer } from 'services/commands'
import { getToken } from 'redux/user/selectors'

import './styles.scss'
import { useState } from 'react'

export const ResetSection = ({ deviceId } : any) => {
  const token = useSelector(getToken)
  const [loading, setLoading] = useState(false);

  const sendResetCommand = async () => {
    setLoading(true)

    try {
      const res = await sendCommandToServer({
        token,
        commandName: 'RESET',
        deviceId
      })
  
      if(res) {
        setLoading(false)
      }
    } catch(err) {
      console.error(err)
      setLoading(false)
    }

  }

  return (
    <div className='reset-section'>
      <div>
        <h2>Reiniciar estação local</h2>
        <p>
          A estação local pode demorar por volta de 10 segundos para reiniciar e estabilizar a conexão com a internet.
          Verifique a sua conexão com a internet antes de reiniciar.
        </p>
      </div>
      <div className='reset-section__button-container'>
        <Button
          onClick={sendResetCommand}
          variant='cancel'>
            {loading ? <Loading /> : 'Reiniciar'}
        </Button>
      </div>
    </div>
  )
}