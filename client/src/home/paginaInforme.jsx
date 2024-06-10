import React, { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import { useLocation } from 'react-router-dom';
import '../home/home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


function PaginaUsuarios() {
  const navegar = useNavigate();
  Axios.defaults.withCredentials = true;
  const query = new URLSearchParams(useLocation().search);
  const estudianteId = query.get('id_estudiante');
  const docenteId = query.get('id_docente');
  const modificar = query.get('modificar') === 'true';
  const alerta = withReactContent(Swal);
  const [datosCargados, setDatosCargados] = useState(false);
  let informeId;
  if (modificar) {
    informeId = query.get('id_informe');
  }
  const formatoFecha = (dates) => {
    const date = (dates === undefined) ? new Date() : new Date(dates);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [progreso, setProgreso] = useState(0);
  const [fechaInforme, setFechaInforme] = useState(formatoFecha());
  const [estudiante, setEstudiante] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [tareaNueva, setTareaNueva] = useState('');


  const crearInforme = (event) => {
    event.preventDefault();
if(modificar){
  Axios.post("http://localhost:3001/actualizarInforme",
    {
      id:informeId,
      id_estudiante: estudiante.id,
      fecha_informe: formatoFecha(fechaInforme),
      progreso: progreso,
      actividades: actividades
    }).then((res) => {
      if (res.data.valid) {
        alerta.fire({
          title: "Exito",
          text: "Se modificó la información",
          icon: 'success',
          confirmButtonText: "Aceptar"
        });
        navegar(`/paginaEstudiante?id_estudiante=${estudianteId}&id_docente=${docenteId}`);
      } else {
        alerta.fire({
          title: "Error",
          text: "No se realizo el registro",
          icon: 'error',
          confirmButtonText: "Aceptar"
        });
      }
    }).catch((err) => {
      alerta.fire({
        title: "Error",
        text: err,
        icon: 'error',
        confirmButtonText: "Aceptar"
      });
      console.error(err);
    });
}else{
  Axios.post("http://localhost:3001/agregarInforme",
    {
      id_estudiante: estudiante.id,
      fecha_informe: formatoFecha(fechaInforme),
      progreso: progreso,
      actividades: actividades
    }).then((res) => {
      if (res.data.valid) {
        alerta.fire({
          title: "Exito",
          text: "Registro Exitoso",
          icon: 'success',
          confirmButtonText: "Aceptar"
        });
        navegar(`/paginaEstudiante?id_estudiante=${estudianteId}&id_docente=${docenteId}`);
      } else {
        alerta.fire({
          title: "Error",
          text: "No se realizo el registro",
          icon: 'error',
          confirmButtonText: "Aceptar"
        });
      }
    }).catch((err) => {
      alerta.fire({
        title: "Error",
        text: err,
        icon: 'error',
        confirmButtonText: "Aceptar"
      });
      console.error(err);
    });
}
  };


  const agregarTarea = (event) => {
    event.preventDefault();
    let tareanueva = tareaNueva.trim();
    if (tareanueva.length != 0) {
      setActividades((actividades) => [...actividades, { descripcion: tareanueva }]);
      setTareaNueva('');
    }
  };

  const eliminarTarea = (index,event) => {
    event.preventDefault();
    const filasmodificadas = actividades.filter((row, i) => i !== index);
    setActividades(filasmodificadas);
  };

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
                if (res.data !== "No hay registro") {
                  res.data.map((val, key) => {
                    setFechaInforme(formatoFecha(val.fecha_informe));
                    setProgreso(val.progreso);
                  })
                }
                Axios.post("http://localhost:3001/seleccionActividadesInforme", { idInforme: informeId }).then((res) => {
                  if (res.data !== "No hay registro") {
                    setActividades(res.data);
                  }
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-5 p-5">
            <div className="container">
              <form onSubmit={(evt) => crearInforme(evt)}>
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
                    value={fechaInforme}
                    onChange={(evt) => setFechaInforme(evt.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Progreso</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={progreso}
                    className="form-control"
                    name="progreso"
                    onChange={(evt) => setProgreso(evt.target.value)}
                    required
                  />
                </div>
                <h3>Actividades</h3>

                <input
                  type="text"
                  className="form-control"
                  value={tareaNueva}
                  onChange={(event) => setTareaNueva(event.target.value)}
                  onSubmit={(evt) => agregarTarea(evt)}
                />
                <div className="mb-3 mx-auto p-2 ">
                  <button type="button" className="boton" onClick={(evt) => agregarTarea(evt)}>Agregar</button>
                </div>
                <table >
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividades.length === 0 ?
                      (
                        <tr >
                          <td></td>
                          <td></td>
                        </tr>
                      ) : (actividades.map((actividad, key) => (
                        <tr key={key}>
                          <td>{actividad.descripcion}</td>
                          <td>
                            <button onClick={(evt) => eliminarTarea(key,evt)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      )))
                    }
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </tbody>
                </table>
                <div className="row p-3">
                  <div className="col-9"><button type="submit" className="boton ">
                    Enviar
                  </button></div>
                  <div className="col-2"><button type="button" className="boton " onClick={()=>(navegar(`/paginaEstudiante?id_estudiante=${estudianteId}&id_docente=${docenteId}`))}>
                    Cancelar
                  </button></div>
                </div>
              </form>
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
