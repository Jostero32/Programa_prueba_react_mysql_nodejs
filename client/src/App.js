import './App.css';
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import Login from './login/login.jsx';
import Home from './home/home.jsx';
import { AuthProvider } from './authContext.js';
import ProtectedRoute from './protectedRoute.js';

function App() {


  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>


  );
}

export default App;
