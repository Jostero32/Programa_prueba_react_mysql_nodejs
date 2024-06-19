import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import "./CrearEstudiante.css"; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function CrearEstudiante() {
  const [nombre, setNombre] = useState("");
  const [tema, setTema] = useState("");
  const [fechaAprobacion, setFechaAprobacion] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [idCarrera, setIdCarrera] = useState("");
  const navegar = useNavigate();
  const alerta = withReactContent(Swal);
  
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/carreras")
      .then((res) => {
        setCarreras(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/agregarEstudiante", {
      nombre,
      tema,
      fechaAprobacion,
      idCarrera
    })
      .then((res) => {
        if (res.data.valid) {
          alerta.fire({
            title: "Exito",
            text: "Se ha Registrado un estudiante.",
            icon: 'success',
            confirmButtonText: "Aceptar"
          });
            navegar("/home");
        } else {
          alerta.fire({
            title: "Error",
            text: "No se ha podido crear el Estudiante",
            icon: 'error',
            confirmButtonText: "Aceptar"
          });
        }
      })
      .catch((err) => {
        alerta.fire({
          title: "Error",
          text: err,
          icon: 'error',
          confirmButtonText: "Aceptar"
        });
        console.log(err);
      });
  };

  const handleBack = () => {
    navegar(-1);
  };

  return (
    <>
      <Navbar />
      <div className="paginaCrearEstudiante container p-3">
        <h2>Crear Estudiante</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Tema:</label>
            <input
              type="text"
              className="form-control"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Aprobación:</label>
            <input
              type="date"
              className="form-control"
              value={fechaAprobacion}
              onChange={(e) => setFechaAprobacion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Carrera:</label>
            <select
              className="form-control"
              value={idCarrera}
              onChange={(e) => setIdCarrera(e.target.value)}
              required
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons-container">
            <button type="submit" className="btn boton">
              Crear
            </button>
            <button type="button" className="btn boton" onClick={handleBack}>
              Regresar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CrearEstudiante;