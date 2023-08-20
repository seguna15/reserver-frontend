import './App.css';
import Login from './components/Login';
import {BrowserRouter, Routes, Route, } from 'react-router-dom'
import Register from './components/Register';
import Home from './components/Home';
import { useState, useEffect } from 'react';
import axios from "axios";
import Header from './components/Header';
import Reservation from './components/Reservation';
import ShowReservation from './components/ShowReservation';






function App() {
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [navigate, setNavigate] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState('');

  //handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await axios.post(
        "https://34.117.86.114/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const userEmail = response.data.email;
      localStorage.setItem("auth", userEmail);
      
      setUser(userEmail);
      setNavigate(true);
      
    } catch (error) {
      if(error.response.status === 401){
        setLoginError('Enter valid credentials')
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const authEmail = localStorage.getItem("auth");
    if (authEmail) { 
      setUser(authEmail);
    }
  }, [user]);
      
   const handleLogout = async (e) => {
      e.preventDefault();
       try {
          await axios.get("https://34.117.86.114/auth/logout");
          setUser('');
          localStorage.removeItem('auth');
          setNavigate(false);       
       } catch (error) {
        console.log(error);
      }
   }

  
  return (
    <BrowserRouter>
      <Header handleLogout={handleLogout} user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/reservation"
          element={
            <Reservation
              setUser={setUser}
              user={user}
              setNavigate={setNavigate}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/get-reservation"
          element={
            <ShowReservation
              setUser={setUser}
              user={user}
              setNavigate={setNavigate}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              handleLogin={handleLogin}
              navigate={navigate}
              setEmail={setEmail}
              setPassword={setPassword}
              loginError={loginError}
              user={user}
            />
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
