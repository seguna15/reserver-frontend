import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

const ShowReservation = ({ setUser, user, setNavigate, navigate }) => {
  
  const [reservationData, setReservationData] = useState([]);
  const [errors, setErrors] = useState('');

  const fetchReservation = async () => {
     try {
       const res = await axios.get(
         "https://34.117.86.114/reservations/get-by-user",
         { withCredentials: true }
       );

       const reservations = res.data;
       setReservationData(reservations);
     } catch (error) {
      
      if(error.response.status === 403){
        console.log(error);
        localStorage.removeItem('auth');
        setUser('')
        setNavigate(false);
        return
      }
      
      setErrors('Something went wrong, we could not fetch your reservations')
     } 
  }
  useEffect(() => {
    fetchReservation();
  },[])
  return (
    <main>
      <div className="container show-reservation">
        {errors && (
          <div className=" text-center">
            <h2>
              {errors}
              {user}
            </h2>
          </div>
        )}
        {!errors && user && (
          <>
            <div className="text-center">
              <h2>Your reservartions {user}</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">startDate</th>
                  <th scope="col">EndDate</th>
                  <th scope="col">InvoiceId</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Fee</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {reservationData.map((data, index) => {
                  return (
                    <tr key={data._id}>
                      <td>{++index}</td>
                      <td>{new Date(data.startDate).toDateString()}</td>
                      <td>{new Date(data.endDate).toDateString()}</td>
                      <td>{data.invoiceId}</td>
                      <td>{data.destination ? data.destination : "none"}</td>
                      <td>${data.charge ? data.charge : "0"}</td>
                      <td>{new Date(data.timestamp).toDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {!user && (
          <main>
            <div className="form-signin text-center">
              <h2>Log in to view your reservations</h2>
              <Link
                to="/login"
                type="button"
                className="btn btn-primary btn-outline-light me-2"
              >
                login
              </Link>
            </div>
          </main>
        )}
      </div>
    </main>
  );
};

export default ShowReservation;
