import { useRef, useState } from 'react'
import _ from 'lodash'
import {
  MdCircleNotifications as BellIcon
} from 'react-icons/md'
import { Tooltip } from 'react-tooltip'

import './styles.scss'
import { useFetch } from 'hooks/useFetch'
import { fetchUserNotifications } from 'services/notifications'
import { Notification } from 'types/interfaces'
import { useOutsideHandler } from 'hooks/useOutsideClickHandler'
import moment from 'moment'
import { NavLink } from 'react-router-dom'

export const NotificationButton = () => {
  const containerRef = useRef(null)
  const [showContainer, setShowContainer] = useState(false)
  const { 
    data: {
      data: notifications
    }
  } = useFetch((args: any) => fetchUserNotifications({ ...args, limit: 3 }), [])

  useOutsideHandler(containerRef, () => setShowContainer(false));

  const hasUnreadNotifications = _.some(notifications, (item: Notification) => !item.isRead)

  const toggleNotificationsContainer = () => {
    setShowContainer(!showContainer)
  }

  return (
    <div className='notifications-button'>
      <div
        id='notification-icon'
        className='notifications-button__icon'
        onClick={toggleNotificationsContainer}>
        <BellIcon size={32} />
        {hasUnreadNotifications ? <div className='notification-indicator' /> : null}
      </div>
      <Tooltip id='app-tooltip' anchorSelect={`#notification-icon`}>
        Notificações
      </Tooltip>
      {showContainer ? (
        <div
          className='notifications-button__container'
          ref={containerRef}>
          <h2>Notificações</h2>
          {_.isEmpty(notifications) ? null :
            (<ul className='notifications-list'>
              {_.map(notifications, (item: Notification) => {
                const { 
                  content: { 
                    title = '',
                    message = ''
                }} = item

                return (
                  <li
                    key={item._id}
                    className='notifications-list__item'>
                    <div>{moment(item.createdAt).format('DD/MM/YY[,] h:mm a')}</div>
                    <h4>{title}</h4>
                    <div>{message}</div>
                  </li>
                )
              })}
            </ul>)}
          <NavLink to='/notificacoes'>Ver mais</NavLink>
        </div>) : null}
    </div>
  )
}