import {
  TbCircleFilled as CircleFilled,
  TbCircleXFilled as OfflineIcon
} from  'react-icons/tb'

import './styles.scss'

export const PulsingCircle = ({ type = 'online'} : any) => {
  if (type === 'offline') {
    return <OfflineIcon />
  }

  return (
    <div className='pulsing-circle'>
      <div className='pulsing-circle__bg-pulse' />
      <CircleFilled className={`pulsing-circle__icon--${type}`} />
    </div>
  )
}