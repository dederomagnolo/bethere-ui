import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import {
  MdCircleNotifications as BellIcon
} from 'react-icons/md'
import { Tooltip } from 'react-tooltip'

import { useFetch } from 'hooks/useFetch'
import { fetchUserNotifications } from 'services/notifications'
import { Notification } from 'types/interfaces'
import { useOutsideHandler } from 'hooks/useOutsideClickHandler'

import './styles.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setNotifications } from 'redux/notifications/actions'
import { getNotifications } from 'redux/notifications/selectors'

export const NotificationButton = () => {
  const containerRef = useRef(null)
  const dispatch = useDispatch()
  const notificationsFromStore = useSelector(getNotifications)
  const [showContainer, setShowContainer] = useState(false)
  const { 
    data: {
      data: notifications
    }
  } = useFetch(async (args: any) => {
    return await fetchUserNotifications({ ...args, page: 1 })
  }, [])

  useEffect(() => {
    dispatch(setNotifications(notifications))
  }, [notifications])

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
          {!notificationsFromStore.length ? <div>Você não possui notificações.</div> :
            (<ul className='notifications-list'>
              {_.map(notificationsFromStore.slice(1,4), (item: Notification) => {
                const {
                  isRead,
                  content: { 
                    title = '',
                    message = ''
                }} = item

                return (
                  <li
                    key={item._id}
                    className='notifications-list__item'>
                    <div className='notification-content__info'>
                      <div className='notification-content__date'>
                        {moment(item.createdAt).format('DD/MM/YY[,] h:mm a')}
                      </div>
                      <div>
                        <h4>{title}</h4>
                        <div>{message}</div>
                      </div>
                    </div>
                    {isRead ? null : <div className='notification-indicator' />}
                  </li>
                )
              })}
            </ul>)}
          <NavLink
            className='navigation-link'
            to='/notificacoes'>
              Ver mais
          </NavLink>
        </div>) : null}
    </div>
  )
}