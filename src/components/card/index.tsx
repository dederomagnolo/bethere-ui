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
  settingsButtonRoute?: string
  label: string
  type?: string
  CustomData?: () => JSX.Element
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
  settingsButtonRoute,
  CustomData,
  label,
  icon
} : GenericCardProps) => {
  const renderSettingsButton = () =>
    settingsButtonRoute && (
      <div className='generic-card__settings'>
        <Cog size='22px' />
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
      </div>
    </div>
  )
}