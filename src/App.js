import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import { UserContextProvider } from './context/userContext';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={ <PrivateRoute><Home /></PrivateRoute>}  />
          <Route path="/profile" element={ <PrivateRoute><Profile /></PrivateRoute>}  />
          <Route path="/register" element={ <Register />}  />
          <Route path="/login" element={ <Login />}  />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
