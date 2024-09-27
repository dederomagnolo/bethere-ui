import _ from 'lodash'
import { Actuator, Automation, Device } from 'types/interfaces'
import { Card } from '../blocks/card'

interface Props {
  programs: Automation[],
  userDevices: Device[]
}

export const General = ({
  programs,
  userDevices
}: Props) => {

  const allActuators = _.flatten(
    _.map(userDevices, (device) =>
      _.map(device.actuators, (actuator) => ({
        ...actuator,
        deviceId: device._id
      })
    )
  ))

  return (
    <div className='general'>
      {_.map(allActuators, (actuator: Actuator & { deviceId: string }) => {
        const automationId = actuator.automationId
        const program = _.find(programs, (program) => program._id === automationId)
        const device = _.find(userDevices, (item: Device) => item._id === actuator.deviceId)
        const sensors = device?.sensors || []

        console.log({ program })
        
        return (
          <Card
            shouldAllowTriggerAutomation={sensors?.length > 0}
            automation={program}
            actuatorNumber={actuator.boardNumber}
            actuatorName={actuator.name} />
        )
      })}
    </div>
  )
}