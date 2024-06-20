import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Loading } from 'components'

import _ from 'lodash'
import {
  Button,
  Modal
} from 'components'

import { fetchAlerts } from 'services/alerts'

import { getToken } from 'redux/user/selectors'
import { useFetch } from 'hooks/useFetch'

import './styles.scss'

import { ModalContent } from './blocks/modal-content'
import { Alerts } from './blocks/alerts'

export const AlertsConfig = ({ sensors, deviceId }: any ) => {
  const [showAlertForm,  setShowAlertForm] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(undefined) as any
  const [alertsToRender, setAlertsToRender] = useState([])
  const token = useSelector(getToken)

  const { loading } = useFetch(async () => {
    const alerts = await fetchAlerts({
      deviceId,
      token
    })
    const alertsByDevice = _.get(alerts, 'data', [])
    setAlertsToRender(alertsByDevice)
  }, [deviceId])

  return (
    <div className='options'>
      <div>
        <div className='description'>
          Configure o envio de alertas para o seu email caso um limite de medição seja atingido por um sensor.
          É possível configurar no máximo 6 alertas.
        </div>
        <Modal
          onRequestClose={() => {setShowAlertForm(false)}}
          isOpen={showAlertForm} >
          <ModalContent
            onUpdate={setAlertsToRender}
            deviceId={deviceId}
            onClose={() => setSelectedAlert(null)}
            alertToEdit={selectedAlert}
            toggleModal={setShowAlertForm}
            sensors={sensors} />
        </Modal>
        <div className='alert-configs'>
          {loading && <Loading className='alert-configs__loading' />}
          {alertsToRender.length 
            ? (
              <Alerts
                selectedAlert={selectedAlert}
                setSelectedAlert={setSelectedAlert}
                sensors={sensors}
                alerts={alertsToRender} 
                handleAlertClick={(alert: any) => {
                  setShowAlertForm(true)
                  setSelectedAlert(alert)
                }}
                />
            ) : null}
          <Button
            disabled={alertsToRender.length >= 6}
            className='alert-configs__button'
            onClick={() => setShowAlertForm(true)}>
            Novo Alerta
          </Button>
        </div>
      </div>
    </div>
  )
}