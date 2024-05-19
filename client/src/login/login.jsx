import React, { useState} from 'react'
import Axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email,setEmail]= useState("");
  const [clave,setClave]= useState("");
  const navegar=useNavigate();

Axios.defaults.withCredentials=true;

useEffect(() => {
  Axios.get("http://localhost:3001")
    .then((res) => {
      if (res.data.valid) {
        navegar('/home');
      } else {
        navegar("/");
      }
    })
    .catch((err) => console.log(err));
}, []);

function validar(event){
event.preventDefault();
Axios.post('http://localhost:3001/login',{email,clave}).then(
res=>{
  if(res.data.length>0){
    navegar('/home');
  }else{
    alert('Usuario o Contraseña erroneos.');
  }
}
  
).catch(err=>console.log(err));
}

  return (
    <div>
      <form onSubmit={validar}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" placeholder='Ingresa tu Email' onChange={(event) => setEmail(event.target.value)}/>
        </div>
        <div>
        <label htmlFor="password">Email</label>
          <input type="password" placeholder='Ingresa tu Contraseña' onChange={(event) => setClave(event.target.value)}/>
        </div>
        <button>Iniciar Sesion</button>
      </form>
    </div>
  )
}

export default Login