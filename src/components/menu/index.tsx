import React, { useState } from 'react'
import _ from 'lodash'
import { NavLink, useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import {
  HiHome as Home,
  HiClock as Clock,
  HiChartBar as Chart,
  HiCog as Cog,
} from 'react-icons/hi'
import {
  FaSignOutAlt as SignOut
} from 'react-icons/fa'

import {
  IoIosArrowBack as Arrow
} from 'react-icons/io'

import {
  MenuProps,
  MenuItemProps
} from './interface'

import { clearUserState } from '../../redux/user/actions'

import whale from '../../assets/bethere_whale.png'
import logo from '../../assets/bethere_logo.png'
import './styles.scss'
import { getToken } from 'redux/user/selectors'

const renderIcon = (BaseIcon: any) => <BaseIcon size={22} />

const MenuItem = ({
  name,
  Icon,
  path,
  expanded,
  onClick
}: MenuItemProps) => {
  const renderItemName = expanded && name

  const Item = () => path ? (
    <li className='menu-item__content'>
      <NavLink
        className={({ isActive }) =>
          isActive ? 'selected-item' : undefined
        }
        to={path}>
          <Icon />
          {renderItemName}
      </NavLink>
    </li>) : (
      <button
        className='menu-item__content'
        onClick={() => onClick && onClick()}>
        <Icon />
        {renderItemName}
      </button>
    )

  return (
   <div className='menu-item__container'>
    <Item />
    <span className='menu-item__label'>{name}</span>
   </div>
  )
}

const renderMenuItemList = (expanded: boolean, menuItems: any) => {
  const mapMenuItems = _.map(menuItems, (item) => {
    const path = _.get(item, 'path')
    const { name, icon, onClick } = item
    return (
      <MenuItem
        key={name}
        expanded={expanded}
        name={name}
        Icon={icon}
        path={path}
        onClick={onClick} />
    )
  })

  return (
    <ul
      className='menu-items'
      role='menu'>
      {mapMenuItems}
    </ul>
  )
}

export const Menu: React.FunctionComponent<MenuProps> = () => {
  const [expandedMenu, setExpandedMenu] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(getToken)

  if(!token) return null

  const handleLogout = () => {
    dispatch(clearUserState())
    navigate('/login')
  }
  
  const menuItems = {
    home: {
      name: 'Início',
      icon: () => renderIcon(Home),
      path: '/'
    },
    history: {
      name: 'Histórico',
      icon: () => renderIcon(Clock),
      path: '/historico'
    },
    charts: {
      name: 'Gráficos',
      icon: () => renderIcon(Chart),
      path: '/graficos'
    },
    settings: {
      name: 'Configurações',
      icon: () => renderIcon(Cog),
      path: 'configuracoes'
    },
    exit: {
      name: 'Sair',
      icon: () => renderIcon(SignOut),
      onClick: () => handleLogout()
    }
  }

  const menuContainerClassname = cx('menu-container', {
    'expanded-menu': expandedMenu
  })

  const logoClassname = cx('logo', {
    'expanded-menu': expandedMenu
  })

  const renderExpandMenuButton = () => {
    return (
      <button
        className={`expand-button expand-button--${expandedMenu ? 'expanded' : 'closed'}`}
        onClick={() => setExpandedMenu(!expandedMenu)}>
        <Arrow size={12} />
      </button>
    )
  }
  
  return (
    <div className={menuContainerClassname}>
      {/* {renderExpandMenuButton()} */}
      <div className='logo-container'>
        <img
          className={logoClassname}
          src={expandedMenu ? logo : whale}
          alt='logo bethere' />
      </div>
      {renderMenuItemList(expandedMenu, menuItems)}
    </div>
  )
}