import { TbCircleDotted as ConnectingIcon } from  'react-icons/tb'

import './styles.scss'

export const Loading = ({ Component, size, className }: any) => {
  return (
  Component
    ? <div className='loading-container'><Component /></div>
    : <ConnectingIcon
        size={size || 20}
        className={`animated-dashed-loading ${className}`} />
  )
}