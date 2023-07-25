import { 
  HiCog as Cog
} from 'react-icons/hi'

import './styles.scss'
import { useEffect } from 'react'

interface CardLabelProps {
  label: string
  Icon?: any
}
interface GenericCardProps {
  columnOrientation?: string
  className?: string
  settingsButtonRoute?: string
  label: string
  type?: string
  CustomData?: () => JSX.Element
  icon?: any,
  children?: any
}

const renderIcon = (BaseIcon: any) => <BaseIcon className='card-label-icon' size={22} />

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
  settingsButtonRoute,
  CustomData,
  label,
  icon,
  children
} : GenericCardProps) => {

  useEffect(() => {
    console.log('card mount')
  }, [])

  const renderSettingsButton = () =>
    settingsButtonRoute && (
      <div className='generic-card__settings'>
        <Cog size={18} />
      </div>
    )

  return (
    <div className={`generic-card generic-card--${type} ${className ? className : ''}`}>
      {renderSettingsButton()}
      <div className='card-infos'>
        <CardLabel Icon={icon} label={label} />
      </div>
      <div className={`card-data card-data--${type}`}>
        {CustomData && <CustomData />}
        {children}
      </div>
    </div>
  )
}