import React, { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import { useLocation } from 'react-router-dom';
import '../home/paginaEstudiante.css';
import logo from '../home/logo-sitio-fisei-2020.png';
import './home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function PaginaUsuarios() {
  const navegar = useNavigate();
  Axios.defaults.withCredentials = true;
  const alerta = withReactContent(Swal);
  const query = new URLSearchParams(useLocation().search);
  const estudianteId = query.get('id_estudiante');
  const docenteId = query.get('id_docente');
  const [estudiante, setEstudiante] = useState([]);
  const [informes, setInformes] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const borrarInforme = (informeId) => {
    Axios.delete('http://localhost:3001/borrarInforme', {
      data: { id: informeId,id_estudiante:estudianteId }
    })
      .then((response) => {
        if (response.data.valid) {
          alerta.fire({
            title: '¡Eliminado!',
            text: 'El informe y sus actividades han sido eliminados exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(()=>{
            window.location.reload();
          })
          
        } else {
          alerta.fire({
            title: 'Error',
            text: 'Hubo un error al eliminar el informe y sus actividades.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      })
      .catch(error => {
        alerta.fire({
          title: 'Error',
          text: `Hubo un error: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });

  }

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
          Axios.post("http://localhost:3001/seleccionEstudianteInfo", {
            idEstudiante: estudianteId, idDocente: docenteId
          })
            .then((res) => {
              res.data.map((val, key) => {
                setEstudiante({
                  id: val.id,
                  nombre: val.nombre,
                  carrera: val.carrera,
                  id_docente: val.id_docente,
                  tema: val.tema,
                  fechaAprobacion: new Date(val.fecha_aprobacion).toLocaleDateString()
                })
              })
            })
            .catch((err) => console.log(err));


          Axios.post("http://localhost:3001/seleccionInformesEstudiante", {
            idEstudiante: estudianteId
          })
            .then((res) => {
              if (res.data !== "No hay registro" && res.data !== "Error") {
                setInformes(res.data);
              }
              setDatosCargados(true);
            })
            .catch((err) => console.log(err));

        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err))

  }, []);


  if (!datosCargados) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card mb-3 info-estudiante" >
          <div className="row g-0">
            <div className="col-md-3 imagen">
              <img src={logo} className="img-fluid rounded-start" alt="imagen del estudiante" />
            </div>
            <div className="col-md">
              <div className="card-body">
                <br />
                <h3 className="card-title">{estudiante.nombre}</h3>
                <h6>Carrera: {estudiante.carrera}</h6>
                <p className="card-text">{'"' + estudiante.tema + '"'}</p>
                <p className="card-text"><small className="text-body-secondary">Aprobado: {estudiante.fechaAprobacion}</small></p>
              </div>
            </div>
          </div>
          <div className="row g-0 ">
            <div className="col-3"></div>
            <div className="col-md pb-5">
              <button className="boton" onClick={() => navegar(`/paginaInforme?id_estudiante=${estudianteId}&id_docente=${docenteId}&modificar=${false}`)}>Agregar Informe</button>
            </div>
            <div className="col-md pb-5">
              <button className="boton">Generar Anexo 11</button>
            </div>
          </div>
          <div className="row g-0 ">
            <table >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Informe</th>
                  <th scope="col">Fecha de Informe</th>
                  <th scope="col">Progreso</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {informes.map((informe, key) => (
                  <tr key={informe.id}>
                    <th>{key + 1}</th>
                    <td>Informe {key + 1}</td>
                    <td>{new Date(informe.fecha_informe).toLocaleDateString()}</td>
                    <td>{informe.progreso}%</td>
                    <td className="acciones">
                      <button className="btn eliminar" onClick={() => borrarInforme(informe.id)}>
                        <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Eliminar" />
                      </button>
                      <button className="btn editar" onClick={() => navegar(`/paginaInforme?id_estudiante=${estudianteId}&id_docente=${docenteId}&modificar=${true}&id_informe=${informe.id}`)}>
                        <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Editar" />
                      </button>
                      <button className="btn hecho">
                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Marcar como Hecho" />
                      </button>
                    </td>
                  </tr>
                ))
                }
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div >

    </>
  );
}

export default PaginaUsuarios;
