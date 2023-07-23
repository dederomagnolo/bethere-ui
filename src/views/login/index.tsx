import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import {
  BsFillPersonFill as UserIcon,
  BsLockFill as LockIcon,
  BsFillEyeFill as EyeIcon,
} from 'react-icons/bs'

import { Button, Input } from 'components/ui-atoms'

import { setUserInfo } from '../../redux/user/actions'
import { setUserDevices } from '../../redux/device/actions'

import { getToken } from '../../redux/user/selectors'

import callApi from '../../services/callApi'

import logo from '../../assets/bethere_logo.png'

import './styles.scss'
import { setGlobalError } from 'redux/global/actions'

export const Login = () => {  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('kumaa')
  const [password, setPassword] = useState('testing123')
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
        service: '/user/authenticate'
      })

      if (res) {
        // the response with status 200 is being filtered on callApi
        if (res.status) {
          return dispatch(setGlobalError({ message: res.error, service: 'login', status: res.status }))
        }

        const token = _.get(res, 'token')
        const userId = _.get(res, 'user._id')
        
        dispatch(setUserInfo({ token, userId, authenticated: true }))

        const devices = _.get(res, 'user.devices')
        dispatch(setUserDevices(devices))
        navigate('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='login-view'>
      <div className='login-card'>
        <div className='login-card__container'>
          <div className='logo'>
            <img src={logo}></img>
            <p>Seu jardim inteligente</p>
          </div>
          <div className='form-group'>
            <div className='form-group__field'>
              <UserIcon className='user' />
              <Input
                onChange={handleUsernameChange}
                type='email'
                placeholder=''
                />
            </div>
            <div className='form-group__field'>
              <LockIcon />
              <Input
                onChange={handlePasswordChange}
                type='password'
                placeholder=''
              />
            </div>
            <Button onClick={handleLoginRequest}>Entrar</Button>
          </div>
          <a href=''>Esqueceu sua senha?</a>
        </div>
      </div>
    </div>
  );
};
