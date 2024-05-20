import React from "react";
import { useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import { useLocation } from 'react-router-dom';


function PaginaUsuarios() {
  const navegar= useNavigate();
  Axios.defaults.withCredentials=true;
  const query=new URLSearchParams(useLocation().search);

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
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
      <img src="..." className="img-fluid rounded-start" alt="..." />
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h5 className="card-title">estudiante: {query.get('id_estudiante')}</h5>
        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
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
