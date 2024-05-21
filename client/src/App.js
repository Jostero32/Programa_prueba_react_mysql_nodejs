import './App.css';
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import Login from './login/login.jsx';
import Home from './home/home.jsx';
import Estudiante from "./home/paginaEstudiante.jsx";
import Informe from "./home/paginaInforme.jsx";


function App() {


  return (

    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/paginaEstudiante' element={<Estudiante />} />
          <Route path='/paginaInforme' element={<Informe />} />
        </Routes>
      </Router>

    </div>


  );
}

export default App;
