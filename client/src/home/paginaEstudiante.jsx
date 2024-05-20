import React, { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import { useLocation } from 'react-router-dom';


function PaginaUsuarios() {
  const navegar= useNavigate();
  Axios.defaults.withCredentials=true;
  const query=new URLSearchParams(useLocation().search);
  const estudianteId=query.get('id_estudiante');
  const docenteId=query.get('id_docente');
  const [estudiante,setEstudiante]=useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
          Axios.post("http://localhost:3001/seleccionEstudianteInfo",{
            idEstudiante:estudianteId,idDocente:docenteId
          })
            .then((res) => {
              res.data.map((val, key) => {
                setEstudiante({
                  id: val.id,
                  nombre: val.nombre,
                  carrera:val.carrera,
                  id_docente: val.id_docente,
                  tema:val.tema,
                  fechaAprobacion:new Date(val.fecha_aprobacion).toLocaleDateString()
                })
              })
            })
            .catch((err) => console.log(err));

        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err))
      
  }, []);

  return (
<>
<Navbar/>
<div>
<div className="card mb-3" >
  <div className="row g-0">
    <div className="col-md-4">
      <img src="..." className="img-fluid rounded-start" alt="imagen del estudiante" />
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h4 className="card-title">{estudiante.nombre}</h4>
        <h6>Carrera: {estudiante.carrera}</h6>
        <p className="card-text">{estudiante.tema}</p>
        <p className="card-text"><small className="text-body-secondary">Aprobado: {estudiante.fechaAprobacion}</small></p>
      </div>
    </div>
  </div>
</div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Masdasdasdasdas</td>
            <td>Oasdasdasdo</td>
            <td>@asdasdasdasd</td>
          </tr>

        </tbody>
      </table>
    </div></>
  );
}

export default PaginaUsuarios;
