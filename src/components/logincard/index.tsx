import React, { useState } from "react";
import _ from 'lodash';
import "./styles.scss";
import logo from "../../assets/bethere_logo.png";
import {
  BsFillPersonFill as User,
  BsLockFill as Lock,
  BsFillEyeFill as Eye,
} from "react-icons/bs";

import callApi from '../../services/callApi'

export const LoginCard = () => {
  let iconStyles = { color: "#dadada" };
  const [username, setUsername] = useState('kumaa')
  const [password, setPassword] = useState('testing123')
  const [iconShow, setIconShow] = useState(true)
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
