import React from 'react'
import { 
  HiCog as Cog
} from 'react-icons/hi'

import './styles.scss'

interface CardLabelProps {
  label: string,
  Icon?: any
}
interface GenericCardProps {
  className?: string
  settingsButtonAvailable?: boolean
  label: string
  type?: string
  data?: any,
  icon?: any
}

const renderIcon = (BaseIcon: any) => <BaseIcon size={22} />

const CardLabel = ({ label, Icon } : CardLabelProps) => {
  const icon = Icon && (
    <div className='iconContainer'>
      {renderIcon(Icon)}
    </div>
  )

  return (
    <div className='cardLabel'>
      {icon}
      <span>{label}</span>
    </div>
  )
}

export const GenericCard = ({
  type = 'default',
  className,
  settingsButtonAvailable,
  data,
  label,
  icon
} : GenericCardProps) => {
  const mockedStatusLabel = 'Online'

  const renderSettingsButton = () => settingsButtonAvailable && <Cog size='28px' />
  const renderCustomData = () => data ? data() : mockedStatusLabel

  return (
    <div className={`genericCard genericCard--${type} ${className}`}>
      <div className='cardInfos'>
        {renderSettingsButton()}
        <CardLabel Icon={icon} label={label} />
      </div>
      <div className={`cardData cardData--${type}`}>
        {renderCustomData()}
      </div>
    </div>
  )
}