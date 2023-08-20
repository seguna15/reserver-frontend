import React, { useState } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";
function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(false);

    const submit =  async(e) => {
        e.preventDefault();

        try {
            await axios.post("http://34.117.86.114/auth/", {
              email,
              password,
            });
             setNavigate(true);
        } catch (error) {
            console.log(error)
        }
       
    }

    if(navigate) {
        return <Navigate to="/login"/>
    }


  return (
    <div className="login-container">
      <main className="form-signin w-100 m-auto">
        <form onSubmit={submit}>
          <h1 className="h3 mb-3 fw-normal">Please register</h1>

          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign up
          </button>
        </form>
      </main>
    </div>
  );
}

export default Register;
