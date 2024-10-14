import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PuffLoader from 'react-spinners/PuffLoader'
import _ from 'lodash'
import moment from 'moment'

import { View } from 'components/app-view'
import { Actions } from 'components/actions'

import { Button, Loading, Paginator } from 'components/ui-atoms'
import { NewCheckbox } from 'components/ui-atoms/new-checkbox'

import { useFetch } from 'hooks/useFetch'

import { Notification } from 'types/interfaces'

import { deleteNotifications, fetchUserNotifications, readNotification } from 'services/notifications'

import { getToken } from 'redux/user/selectors'

import './styles.scss'

export const NotificationsView = () => {
  const token = useSelector(getToken)

  const [deletingOnProgress, setDeletingOnProgress] = useState(false)
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectingMode, setSelectingMode] = useState(false)
  const [notificationsToDelete, setNotificationsToDelete] = useState<string[]>([])
  const [readingLoading, setReadingLoading] = useState<string[]>([])
  const [notificationsToRender, setNotificationsToRender] = useState<Notification[]>([])

  const {
    loading,
    data: {
      data: notifications,
      pages
    }
  } = useFetch(() => fetchUserNotifications({
    token,
    page: selectedPage
  }), [selectedPage])

  useEffect(() => {
    setNotificationsToRender(notifications)
  }, [notifications])

  const handleReadNotificationOnHover = async (id: string) => {
    const isNotificationBeingUpdated = readingLoading.includes(id)

    if (isNotificationBeingUpdated) return
    setTimeout(async () => {
      setReadingLoading([...readingLoading, id])
      const res = await readNotification({ notificationId: id, token })

      if (res) {
        setNotificationsToRender(notificationsToRender.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              isRead: true
            }
          }
          return item
        }))
      }
    }, 1000)
  }

  const handleChangePage = ({ selected }: { selected: number }) => setSelectedPage(selected + 1)
  const handleSelectToDelete = ({
    checked,
    notificationIdToDelete
  }: { checked: boolean, notificationIdToDelete: string}) => {

    if (checked) {
      setNotificationsToDelete([...notificationsToDelete, notificationIdToDelete])
    } else {
      setNotificationsToDelete(
        _.filter(notificationsToDelete, (idOnCollection) =>
          idOnCollection !== notificationIdToDelete)
      )
    }
  }

  const handleDeleteNotifications = async () => {
    try {
      setDeletingOnProgress(true)
    
      const res = await deleteNotifications({
        token,
        notificationsToDelete
      })

      if (res) {
        setSelectedPage(1)
      }
    } catch(err) {
      setDeletingOnProgress(false)
    }
  }

  const renderActions = () => {
    if (loading) return null
    if (!notificationsToRender || notificationsToRender.length === 0) return null

    if (selectingMode) {
      return (
        <Actions
        secondaryButton={{
          disabled: deletingOnProgress,
          variant: 'cancel',
          label: 'Deletar notificações',
          onClick: handleDeleteNotifications
          }}
        primaryButton={{
          disabled: deletingOnProgress,
          label: 'Cancelar',
          onClick: () => {
            setSelectingMode(false)
            setNotificationsToDelete([])
          }
        }} />
      )
    }

    return (
      <Button
        onClick={() => setSelectingMode(true)}>
          Selecionar notificações
      </Button>
    )
  }

  const renderNotificationsList = () => {
    if (loading) return <Loading Component={PuffLoader} /> 
    if (!notificationsToRender || notificationsToRender.length === 0)
      return <div>Você não possui notificações.</div>

    return (
      <ul className='notifications'>
        {_.map(notificationsToRender, (item: Notification) => {
          const { content: { title = '', message = ''} } = item
          const isRead = item.isRead
          return (
            <li
              onMouseLeave={
                () => isRead ? null : handleReadNotificationOnHover(item._id)
              }
              key={item._id}
              className='notifications__item '>
              <div className='notification-content'>
                {selectingMode ? <NewCheckbox
                  initialState={false}
                  onToggle={({ checked }) => handleSelectToDelete({
                    checked,
                    notificationIdToDelete: item._id
                  })} /> : null}
                <div className='notification-content__info'>
                  <div className='notification-content__date'>
                    {moment(item.createdAt).format('DD/MM/YY[,] h:mm a')}
                  </div>
                  <div>
                    <h4>{title}</h4>
                    <div>{message}</div>
                  </div>
                </div>
              </div>
              {isRead ? null : <div className='notification-indicator' />}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <View title='Notificações' className='notifications-view'>
      {pages ? <Paginator
        forcePage={selectedPage - 1}
        numberOfPages={pages}
        onChange={handleChangePage} /> : null}
      {renderNotificationsList()}
      {renderActions()}
    </View>
  )
}