import React, { useState } from 'react'
import _ from 'lodash'
import { NavLink, useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { useDispatch } from 'react-redux'

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

const renderIcon = (BaseIcon: any) => <BaseIcon size={28} />

const MenuItem = ({
  name,
  Icon,
  path,
  expanded,
  onClick
}: MenuItemProps) => {
  const renderItemName = expanded && name

  return (
    path ? (
      <li className='menuItem'>
        <NavLink
          className={({ isActive }) =>
            isActive ? 'selectedItem' : undefined
          }
          to={path}>
            <Icon />
            {renderItemName}
        </NavLink>
      </li>) : (
        <button
          className='menuItem'
          onClick={() => onClick && onClick()}>
          <Icon />
          {renderItemName}
        </button>
      )
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
      className='menuItems'
      role='menu'>
      {mapMenuItems}
    </ul>
  )
}

export const Menu: React.FunctionComponent<MenuProps> = () => {
  const [expandedMenu, setExpandedMenu] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  const menuContainerClassname = cx('menuContainer', {
    expandedMenu
  })

  const logoClassname = cx('logo', {
    expandedMenu
  })

  const renderExpandMenuButton = () => {
    return (
      <button
        className='expandButton'
        onClick={() => setExpandedMenu(!expandedMenu)}>
        <Arrow size={28} />
      </button>
    )
  }
  
  return (
    <div className={menuContainerClassname}>
      {renderExpandMenuButton()}
      <div className='logoContainer'>
        <img
          className={logoClassname}
          src={expandedMenu ? logo : whale}
          alt='logo bethere' />
      </div>
      {renderMenuItemList(expandedMenu, menuItems)}
    </div>
  )
}