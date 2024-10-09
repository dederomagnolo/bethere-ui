import _ from 'lodash'
import { View } from 'components/app-view'
import { useFetch } from 'hooks/useFetch'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserDevices, getUserSensors } from 'redux/device/selectors'
import { getToken } from 'redux/user/selectors'
import { fetchAutomationRoutines } from 'services/automation'
import { Card } from './blocks/card'

import { Actuator, Automation } from 'types/interfaces'
import './styles.scss'
import { Button, TabNav } from 'components'
import { General } from './general'
import { AutomationPrograms } from './programs'

export const AutomationView = () => {
  const token = useSelector(getToken)
  const userDevices = useSelector(getUserDevices)
  const userSensors = useSelector(getUserSensors)

  const [tabOption, setTabOption] = useState(0)

  const [programs, setPrograms] = useState<Automation[]>([])
  const { loading } = useFetch(async () => {
    const response = await fetchAutomationRoutines({
      token
    })
    const automationRoutines = _.get(response, 'data', [])
    setPrograms(automationRoutines)
  }, [])

  const renderAutomationView = () => {
    switch(tabOption) {
      case 0:
        return (
          <General
            userDevices={userDevices}
            programs={programs}/>
        )
      case 1:
        return <AutomationPrograms programs={programs} />
      default:
        return null
    }
  }

  return (
    <View title='Automação' className='automation-view'>
      <TabNav
        onNavChange={(selectedTab: number) => setTabOption(selectedTab)}
        menuLinks={['Visão geral', 'Programas']} />
      
      <div className='automation-view__content'>
        {renderAutomationView()}
      </div>
    </View>
  )
}