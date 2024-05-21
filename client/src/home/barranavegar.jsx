import React from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import '../home/barraNavegar.css'

function Barranavegar() {
  const navegar = useNavigate();
  Axios.defaults.withCredentials = true;

  const cerrarSesion=()=> {
    Axios.get("http://localhost:3001/cerrarSesion").then((res) => {
        navegar("/");

    }).catch(err => console.log(err));
  }

  return (
    <div className="container-fluid px-0">
      <nav className="navbar navbar-expand-sm navbar-dark bg-uta py-0 px-0">
        <a className="navbar-brand" onClick={()=>navegar("/home")} ><img id="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYGTjkfPr57vwnw1rvZUMc9Q2MMRZHUrRJ3NfaFpDbcQ&s" /> &nbsp;&nbsp;&nbsp;UTA</a>
        <span className="v-line"></span>
        <button className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" onClick={cerrarSesion}>
                  Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
      </nav>
    </div>
  );
}

export default Barranavegar;
