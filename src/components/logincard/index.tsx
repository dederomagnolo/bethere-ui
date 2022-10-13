import React from 'react'
import './styles.scss'
import logo from '../../assets/bethere_logo.png'
import { 
  BsFillPersonFill as User,
  BsLockFill as Lock, 
  BsFillEyeFill as Eye} from 'react-icons/bs'


export const LoginCard = () =>{
  let iconStyles = { color: '#dadada' };
 
  return(
  <div className="LoginCard">
    <div className="content">
    <div className="logo">
      <img src={logo}></img>
      <p>Seu jardim inteligente</p>
    </div>


    <div className="form-group">
      <div className='IconUser'>
      <User className='User' style={iconStyles}/>
      <input 
      type="name" 
      placeholder="">
      </input>
      </div>
      <div className='IconPassword'>
      <Lock style={iconStyles}/>
      <input
      type="email"
      placeholder="">
      </input>
      <Eye style={iconStyles}/>
      </div>
    </div>

    <button>
      Entrar
    </button>

    <a href="">Esqueceu sua senha?</a>
  </div>
  </div>
 )
  }