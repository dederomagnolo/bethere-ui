import React from 'react'
import { 
  HiCog as Cog
} from 'react-icons/hi'

import './styles.scss'

interface CardLabelProps {
  label: string
  Icon?: any
}
interface GenericCardProps {
  columnOrientation?: string
  className?: string
  settingsButtonAvailable?: boolean
  label: string
  type?: string
  CustomData?: any
  icon?: any
}

const renderIcon = (BaseIcon: any) => <BaseIcon size={22} />

const CardLabel = ({ label, Icon } : CardLabelProps) => {
  const icon = Icon && (
    <div className='icon-container'>
      {renderIcon(Icon)}
    </div>
  )

  return (
    <div className='card-label'>
      {icon}
      <span>{label}</span>
    </div>
  )
}

export const GenericCard = ({
  type = 'default',
  className,
  settingsButtonAvailable,
  CustomData,
  label,
  icon,
  columnOrientation
} : GenericCardProps) => {
  const renderSettingsButton = () => settingsButtonAvailable && <Cog size='28px' />

  return (
    <div className={`generic-card generic-card--${type} ${className}`}>
      <div className='card-infos'>
        {renderSettingsButton()}
        <CardLabel Icon={icon} label={label} />
      </div>
      <div className={`card-data card-data--${type}`}>
        {CustomData && <CustomData />}
      </div>
    </div>
  )
}