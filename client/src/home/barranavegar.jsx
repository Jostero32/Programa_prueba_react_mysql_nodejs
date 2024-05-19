import React from "react";
import { useNavigate } from "react-router-dom";

function Barranavegar() {
    const navegar=useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" onClick={()=>navegar("/home")}>
            Inicio
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" onClick={()=>navegar("/paginaEstudiante")}>
                  Estudiantes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Docente
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Barranavegar;
