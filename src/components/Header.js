import React from 'react'
import { Link  } from 'react-router-dom';

const Header = ({handleLogout, user }) => {
  
    
  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/" className="nav-link px-2 text-white">
                Home
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/reservation" className="nav-link px-2 text-white">
                    Reservation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/get-reservation"
                    className="nav-link px-2 text-white"
                  >
                    Reservation History
                  </Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="text-end">
              <Link
                to="/login"
                type="button"
                className="btn btn-outline-light me-2"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </div>
          )}

          {!user && (
            <div className="text-end">
              <Link
                to="/login"
                type="button"
                className="btn btn-outline-light me-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                type="button"
                className="btn btn-outline-light me-2"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;