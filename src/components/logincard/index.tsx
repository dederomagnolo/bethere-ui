import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import {
  BsFillPersonFill as User,
  BsLockFill as Lock,
  BsFillEyeFill as Eye,
} from 'react-icons/bs'

import { setUserInfo } from '../../redux/user/actions'
import { setUserDevices } from '../../redux/device/actions'

import { getToken } from '../../redux/user/selectors'

import callApi from '../../services/callApi'

import './styles.scss'
import logo from '../../assets/bethere_logo.png'

export const LoginCard = () => {
  let iconStyles = { color: '#dadada' }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('kumaa')
  const [password, setPassword] = useState('testing123')
  const [iconShow, setIconShow] = useState(true)
  const token = useSelector(getToken)

  const handleUsernameChange = (e: any) => {
    const state = e.target.value
    setUsername(state)
  }

  const handlePasswordChange = (e: any) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleLoginRequest = async () => {
    try {
      const res = await callApi({
        method: 'POST',
        payload: { username, password },
        service: '/auth/authenticate'
      })

      const token = _.get(res, 'token')
      const userId = _.get(res, 'user._id')

      if (token) {
        dispatch(setUserInfo({ token, userId }))

        const devices = _.get(res, 'user.devices')
        dispatch(setUserDevices(devices))
        navigate('/')
      }

      console.log(res)
    } catch (err) {
      console.error('deu pau')
    }
  }

  return (
    <div className="login-card">
      <div className="login-card__container">
        <div className="logo">
          <img src={logo}></img>
          <p>Seu jardim inteligente</p>
        </div>

        <div className="form-group">
          <div className="user-icon">
            {iconShow && <User className="user" style={iconStyles} />}
            <input
              onChange={handleUsernameChange}
              type='email'
              placeholder=""
              onFocus={() => setIconShow(false)}
              onBlur={() => setIconShow(true)}
              >
            </input>
          </div>
          <div className="password-icon">
            {iconShow && <Lock style={iconStyles} />}
            <input
              onChange={handlePasswordChange}
              type='password'
              placeholder=''
              onFocus={() => setIconShow(false)}
              onBlur={() => setIconShow(true)}
            />
            {iconShow && <Eye style={iconStyles} />}
          </div>
        </div>
        <button onClick={handleLoginRequest}>Entrar</button>
        <a href="">Esqueceu sua senha?</a>
      </div>
    </div>
  );
};
