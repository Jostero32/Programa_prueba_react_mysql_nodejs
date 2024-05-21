import React, { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import { useLocation } from 'react-router-dom';

function PaginaUsuarios() {
  const navegar = useNavigate();
  Axios.defaults.withCredentials = true;
  const query = new URLSearchParams(useLocation().search);
  const estudianteId = query.get('id_estudiante');
  const docenteId = query.get('id_docente');
  const modificar = query.get('modificar') === 'true';
  const [datosCargados, setDatosCargados] = useState(false); 
  let informeId;
  if (modificar) {
    informeId = query.get('id_informe');
  }
  const [estudiante, setEstudiante] = useState([]);
  const [informe, setInforme] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [tareaNueva, setTareaNueva] = useState('');


  const agregarTarea = () => {
    setActividades((actividades)=>[...actividades, {descripcion: tareaNueva}]);
    setTareaNueva('');
  }

const eliminarTarea=(index)=>{
  const filasmodificadas = actividades.filter((row, i) => i !== index);
  setActividades(filasmodificadas);
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
                });
                setDatosCargados(true);
              })
            })
            .catch((err) => console.log(err));
          if (modificar) {
            Axios.post("http://localhost:3001/seleccionInforme", {
              idEstudiante: estudianteId, idInforme: informeId
            })
              .then((res) => {
                res.data.map((val, key) => {
                  setInforme({

                  })
                })
              })
              .catch((err) => console.log(err));
          }
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
        <div className="row">
          <div className="col-5">
            <div className="container">
              <form onSubmit={() => console.log("hola")}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Estudiante</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estudiante.nombre}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carrera</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estudiante.carrera}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tema</label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={estudiante.tema}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Aprobación</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estudiante.fechaAprobacion}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Informe</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Progreso</label>
                  <input
                    type="number"
                    className="form-control"
                    name="progreso"
                    required
                  />
                </div>
                <button>
                  Enviar
                </button>
                
              </form>
              <h3>Actividades</h3>

                <input
                  type="text"
                  className="form-control"
                  value={tareaNueva}
                  onChange={(event)=>setTareaNueva(event.target.value)}
                  onSubmit={()=>agregarTarea()}
                />
                <button type="button" onClick={()=>agregarTarea()}>agregar</button>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividades.map((actividad,key) => (
                      <tr key={key}>
                        <td>{actividad.descripcion}</td>
                        <td>
                          <button onClick={()=>eliminarTarea(key)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
          <div className="col">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, excepturi inventore temporibus aspernatur nobis vel optio eius, commodi ex rerum cum expedita, nemo molestiae. Quisquam voluptatum magnam quod debitis! Sit.
          </div>
        </div>
      </div>
    </>
  );
}

export default PaginaUsuarios;
