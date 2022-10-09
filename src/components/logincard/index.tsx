import React from 'react'
import './styles.scss'
import logo from '../../assets/bethere_logo.png'

export const LoginCard = () =>{
 return(
  <div className="LoginCard">
    <div className="content">
    <div className="logo">
      <img src={logo}></img>
      <p>Seu jardim inteligente</p>
    </div>


    <div className="form-group">
      <input 
      type="name" 
      placeholder="">
      </input>
      <input
      type="email"
      placeholder="">
      </input>
    </div>

    <button>
      Entrar
    </button>

    <a href="">Esqueceu sua senha?</a>
  </div>
  </div>
 )
}