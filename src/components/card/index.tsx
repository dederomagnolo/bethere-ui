import {
  BiStation as OnlineIcon
} from 'react-icons/bi'

import './styles.scss'

interface CardLabelProps {
  label: string
  Icon?: any
}

interface GenericCardProps {
  columnOrientation?: string
  className?: string
  label: string
  type?: string
  CustomData?: () => JSX.Element
  icon?: any
  children?: any
}

const renderIcon = (BaseIcon: any) => <BaseIcon className='card-label-icon' size={20} />

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
  CustomData,
  label,
  icon,
  children
} : GenericCardProps) => {

  const renderDeviceSignalIcon = () => (
    <div className='generic-card__settings'>
      <OnlineIcon size={22} />
    </div>
  )

  return (
    <div className={`generic-card generic-card--${type} ${className ? className : ''}`}>
      {type === 'default' && renderDeviceSignalIcon()}
      <div className='generic-card-infos'>
        <CardLabel Icon={icon} label={label} />
      </div>
      <div className={`card-data card-data--${type}`}>
        {CustomData && <CustomData />}
        {children}
      </div>
    </div>
  )
}