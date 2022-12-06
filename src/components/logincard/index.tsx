import React, { useState } from "react";
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
  const [iconShow, setIconShow] = useState(true);

  const handleOnChange = (e: any) => {
    const state = e.target.value
    setUsername(state)
  }

  const handleLoginRequest = async () => {
    try {
      const res = await callApi({
        method: 'POST',
        payload: { username, password },
        service: '/auth/authenticate'
      })

      console.log(res)
    } catch (err) {
      console.error('deu pau')
    }
  }

  return (
    <div className="LoginCard">
      <div className="Content">
        <div className="Logo">
          <img src={logo}></img>
          <p>Seu jardim inteligente</p>
        </div>

        <div className="FormGroup">
          <div className="IconUser">
            {iconShow && <User className="User" style={iconStyles} />}
            <input
              onChange={handleOnChange}
              type="name"
              placeholder=""
              onFocus={()=>setIconShow(false)}
              onBlur={()=>setIconShow(true)}
              >
              </input>
          </div>
          <div className="IconPassword">
            {iconShow && <Lock style={iconStyles} />}
            <input type="email" 
            placeholder=""
            onFocus={()=>setIconShow(false)}
            onBlur={()=>setIconShow(true)}
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
