import React from 'react'
import { Navigate } from "react-router-dom";

function Login({ handleLogin, navigate, setEmail, setPassword, loginError }) {

  if (navigate) {
    return <Navigate to="/reservation" />;
  }

  return (
    <div className="login-container">
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleLogin}>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
          <h4 className="text-warning">{loginError}</h4>
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
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login