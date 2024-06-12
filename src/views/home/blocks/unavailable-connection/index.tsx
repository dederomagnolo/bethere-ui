import {
  TbCircleXFilled as OfflineIcon,
} from  'react-icons/tb'

import './styles.scss'

export const UnavailableConnection = () => (
  <div className='unavailable-connection'>
    <OfflineIcon />
    <p>Indisponível</p>
  </div>
)