import React, { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../login/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const navegar = useNavigate();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
          navegar("/home");
        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function validar(event) {
    event.preventDefault();
    Axios.post("http://localhost:3001/login", { email, clave })
      .then((res) => {
        if (res.data.valid) {
          navegar("/home");
        } else {
          alert("Las credenciales son incorrectas.");
        }


      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div>
        <img className="banner" src="https://www.uta.edu.ec/v3.2/uta/images/header.png" alt="" />
      </div>
      <div className="d-flex vh-50 login-container justify-content-center align-items-center">
        <div className="p-3 w-25">
          <div className="form-login">
            <form onSubmit={validar}>
              <div className="input-login">
                <label htmlFor="email" className="label-login">Email</label><br />
                <input
                  type="email"
                  placeholder="Ingresa tu Email"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="input-login">
                <label htmlFor="password" className="label-login">Contraseña</label><br />
                <input
                  type="password"
                  placeholder="Ingresa tu Contraseña"
                  required
                  onChange={(event) => setClave(event.target.value)}
                />
              </div>
              <div className="boton-iniciarsesion ">
                <button className="btn btn-secondary">Iniciar Sesion</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr />
      <footer>
        <p>2024 - UTA</p>
      </footer>
    </>
  );
}

export default Login;
