import { useState } from 'react';
import _  from 'lodash'
import { useDispatch, useSelector } from 'react-redux';

import {
  AppCollapsible
} from 'components';

import './styles.scss'
import { getUserDevices } from 'redux/device/selectors';
import { DeviceSelector } from 'components/device-selector';

import { getToken } from 'redux/user/selectors';
import { editSettingsAndSendCommand, fetchUserDevices } from 'services/fetch';
import { setUserDevices } from 'redux/device/actions';
import { ResetSection } from './blocks/reset-section';
import { SensorsConfig } from './blocks/sensors-config';
import { AutoWateringConfig } from './blocks/auto-watering-config';
import { ManualWateringConfig } from './blocks/manual-watering-config';
import { BroadcastConfig } from './blocks/broadcast-config';
import { toast } from 'react-toastify';

export const Settings = () => {
  const dispatch = useDispatch()
  const userDevices = useSelector(getUserDevices)
  const token = useSelector(getToken)
  const defaultDevice = _.find(userDevices, (device) => device.defaultDevice)

  // evolution: need to update here to get default settings selected by user

  const initialState = {
    _id: '',
    automation: {
      interval: '',
      startTime: '',
      endTime: '',
      duration: ''
    },
    wateringTimer: '',
    remoteMeasureTimer: ''
  }

  const [selectedDevice, setSelectedDevice] = useState(defaultDevice || { _id: ''})
  const selectedDeviceSettings = _.get(selectedDevice, 'settings[0]', initialState)

  const saveChanges = async (payload: any) => {
    const deviceId = selectedDevice._id
    const settingsId = _.get(selectedDevice, 'settings[0]._id')

    try {
      const res = await editSettingsAndSendCommand({
        token,
        settingsPayload: {
          settingsId, 
          deviceId,
          ...payload,
        }
      })

      dispatch(setUserDevices(res))
      setSelectedDevice(_.find(res, (device) => device._id === deviceId ))
    } catch(err) {
      toast.error("Ocorreu um erro na solicitação", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const collapsibleOptions = [
    {
      title: 'Irrigação manual',
      component: () => (
        <ManualWateringConfig
          saveChanges={saveChanges}
          manualWateringTimer={selectedDeviceSettings.wateringTimer} />
        )
    },
    {
      title: 'Irrigação automática',
      component: () => (
        <AutoWateringConfig
          deviceId={selectedDevice._id}
          saveChanges={saveChanges}
          automationSettings={selectedDeviceSettings.automation}
        />)
    },
    {
      title: 'Sensores',
      component: () => 
        <SensorsConfig
          sensors={_.get(selectedDevice, 'sensors')}
          deviceId={selectedDevice._id} />
    },
    {
      title: 'Medições',
      component: () => (
        <BroadcastConfig
          saveChanges={saveChanges}
          remoteMeasureInterval={selectedDeviceSettings.remoteMeasureInterval} />)
    }
  ]

  const renderCollapsibleOptions = _.map(collapsibleOptions, (option) => {
    const { title, component } = option
    return (
      <div className='collapsible-section' key={title}>
        <AppCollapsible title={title} InnerComponent={component}/>
      </div>
    )
  })

  return (
    <div className='settings-view'>
      <div className='select-device__container'>
        <DeviceSelector
          onChange={setSelectedDevice}
          allowNameEdition
          showDeviceInfo />
      </div>
      <h1>Configurações</h1>
      <div className='collapsible-options'>
        {renderCollapsibleOptions}
      </div>
      <ResetSection deviceId={selectedDevice._id}/>
    </div>
  )
}