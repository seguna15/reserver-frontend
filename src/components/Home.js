import React  from 'react'
import { Link} from "react-router-dom";

const Home = ({user}) => {
   
  return (
    <div className="body-container ">
      <main className=" main-container px-3 mx-auto flex-column">
        <h1>Reserver.</h1>
        <h6>The home of lasting vacations</h6>
        <p className="lead">
          Planning a vacation can be a bit of a daunting task. With reserver,
          you can select your vacation spot from a list of our vacation spots,
          choose your stay period and checkout. Its that easy and hassle free.
        </p>
        <p className="lead">
          {user && (
            <Link
              to="/reservation"
              className="btn btn-lg btn-light fw-bold border-dark bg-white"
            >
              Make reservation
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className="btn btn-lg btn-light fw-bold border-dark bg-white"
            >
              Login to make reservation
            </Link>
          )}
        </p>
      </main>
    </div>
  );
}

export default Home