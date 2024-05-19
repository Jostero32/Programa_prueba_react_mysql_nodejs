import React, { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";


function Home() {
  const [usuario, setUsuario] = useState([]);
  const navegar = useNavigate();

  Axios.defaults.withCredentials=true;



  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return <div>


  </div>;
}

export default Home;
