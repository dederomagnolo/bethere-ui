import { NotificationButton } from 'components/notification-button'
import './styles.scss'

export const View = ({
  title,
  children,
  className
}: any) => {
  return (
    <div className={`app-view ${className}`}>
      <div className='app-view__header'>
        <h2 className='app-view__title'>{title}</h2>
        <NotificationButton />
      </div>
      <div className='app-view__content'>
        {children}
      </div>
    </div>
  )
}