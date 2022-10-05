import React, { useState } from 'react'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'
import {
  HiHome as Home,
  HiClock as Clock,
  HiChartBar as Chart,
  HiCog as Cog
} from 'react-icons/hi'
import {
  FaSignOutAlt as SignOut
} from 'react-icons/fa'

import {
  MenuProps,
  MenuItemProps
} from './interface'

import logo from '../../assets/bethere_logo.png'
import './styles.scss'

const renderIcon = (BaseIcon: any) => <BaseIcon size={28} />

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
  }
}

const exitItem = {
  name: 'Sair',
  icon: () => renderIcon(SignOut)
}

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
          onClick={onClick && onClick()}>
          <Icon />
          {renderItemName}
        </button>
      )
  )
}

const renderMenuItemList = (expanded: boolean) => {
  const mapMenuItems = _.map(menuItems, (item) => {
    const path = _.get(item, 'path')
    const { name, icon } = item
    return (
      <MenuItem
        expanded={expanded}
        name={name}
        Icon={icon}
        path={path} />
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
  const menuContainerClassname = cx('menuContainer', {
    expandedMenu
  })

  const renderExpandMenuButton = () => {
    return (
      <button onClick={() => setExpandedMenu(!expandedMenu)}>O</button>
    )
  }

  const renderExitItem = () => {
    const { name, icon } = exitItem
    return (
      <MenuItem
        expanded={expandedMenu}
        name={name}
        Icon={icon} />
    )
  }
  
  return (
    <div className={menuContainerClassname}>
      {renderExpandMenuButton()}
      <div className='logoContainer'>
        <img
        className='logo'
        src={logo}
        alt='logo bethere' />
      </div>
      {renderMenuItemList(expandedMenu)}
      {renderExitItem()}
    </div>
  )
}