import React, { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import "../home/home.css";

function Home() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtro, setFiltro] = useState("Nombre");
  const navegar = useNavigate();
  const [valorBuscar, setValorBuscar] = useState("");

  Axios.defaults.withCredentials = true;

  const buscarFiltro = () => {
    let nombre = "";
    let carrera = "";
    if (filtro === "Nombre") {
      nombre = valorBuscar.concat("%");
      carrera = "%";
    } else {
      carrera = valorBuscar.concat("%");
      nombre = "%";
    }
    Axios.post("http://localhost:3001/seleccionEstudiantesFiltrados", {
      nombre,
      carrera,
    })
      .then((res) => {
        if (res.data !== "No hay registro") {
          setEstudiantes(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
          Axios.get("http://localhost:3001/seleccionEstudiantes")
            .then((res) => {
              setEstudiantes(res.data);
            })
            .catch((err) => console.log(err));
        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Navbar />

      <div className="paginaHome content">
        <div className="titulo">
        <h2>Estudiantes Tutorados</h2>
        </div>
        <div className="container barraBuscar">
          <div className="input-group imputBuscar">
            <input
              type="text"
              className="form-control"
              aria-describedby="inputGroupFileAddon04"
              onChange={(event) => setValorBuscar(event.target.value)}
            />
            <button
              className="btn btn-outline-muted dropdown-toggle botonBuscar"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {filtro}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => setFiltro("Nombre")}
                >
                  Nombre
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => setFiltro("Carrera")}
                >
                  Carrera
                </a>
              </li>
            </ul>
            <button
              className="btn btn-outline-muted botonBuscar"
              type="button"
              id="inputGroupFileAddon04"
              onClick={buscarFiltro}
            >
              Buscar
            </button>
          </div>
        </div>
        <div className="container">
          <table >
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Carrera</th>
                <th scope="col">Fecha de Aprobación</th>
                <th scope="col">Progreso</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((val, key) => {
                return (
                  <tr key={val.id}>
                    <th scope="row">{val.nombre}</th>
                    <td>{val.carrera}</td>
                    <td>{new Date(val.fecha_aprobacion).toLocaleDateString()}</td>
                    <td>{val.progreso}</td>
                    <td >
                      <button className="button-81" role="button"  onClick={() => console.log(val.id)}>
                        Ver Informes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <hr />
      <footer>
        <p>2024 - UTA</p>
      </footer>
    </>
  );
}

export default Home;
