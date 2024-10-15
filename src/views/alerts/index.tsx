import { useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { Button } from 'components'
import { View } from 'components/app-view'

import { useFetch } from 'hooks/useFetch'
import { fetchAlerts } from 'services/alerts'
import { Alert } from 'types/interfaces'

import { getUserDevices, getUserSensors } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'

import { Alerts } from './alerts-config/blocks/alerts'
import { Form } from './alerts-config/blocks/form'

import './styles.scss'
import { Actions } from './alerts-config/blocks/actions'

const alertInitialState = {
  _id: '',
  alertId: '',
  sensorId: '',
  paramType: -1,
  alertValue: '',
  alertName: '',
  value: '',
  operator: 0
} as Alert

export const AlertsView = () => {
  const token = useSelector(getToken)
  const userDevices = useSelector(getUserDevices)
  const sensors = useSelector(getUserSensors)
  const [userAlerts, setUserAlerts] = useState<Alert[]>([])
  const [showForm, setShowForm] = useState(false)
  const [alertToEdit, setAlertToEdit] = useState<Alert | undefined>(undefined)
  const [deletingMode, setDeletingMode] = useState(false)

  console.log(sensors)
  const { loading } = useFetch(async () => {
    const alerts = await fetchAlerts({
      token
    })
    const alertsByDevice = _.get(alerts, 'data', [])
    setUserAlerts(alertsByDevice)
  }, [])

  const renderActions = () => {
    console.log({
      alertToEdit
    })
    if (showForm && !alertToEdit) return null

    const actionsProps = {
      primaryButton: {
        onClick: () => {
          setAlertToEdit(undefined)
          setShowForm(true)
        },
        label: 'Novo Alerta',
        disabled: userAlerts.length >= 6
      },
      secondaryButton: {
        variant: 'cancel',
        onClick: () => {
          setDeletingMode(true)
        },
        label: 'Deletar Alertas'
      }
    }

    return (
      <Actions
        primaryButton={actionsProps.primaryButton}
        secondaryButton={actionsProps.secondaryButton} />
      )
  }
  
  return (
    <View className='alerts-view' title='Alertas'>
      {showForm 
        ? (
          <Form
            closeForm={() => {
              setShowForm(false)
              setAlertToEdit(undefined)
            }}
            alertToEdit={alertToEdit === undefined ? alertInitialState : alertToEdit}
            onUpdate={setUserAlerts}
            sensors={sensors} />
        ) : (
          <Alerts
            sensors={sensors}
            alerts={userAlerts}
            handleAlertClick={(alert: Alert) => {
              setShowForm(true)
              setAlertToEdit(alert)
            }} />
          )}
      {renderActions()}
    </View>
  )
}