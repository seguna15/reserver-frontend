import axios from "axios";
import React, { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from 'yup';


const Reservation = ({ setUser, user, setNavigate, navigate }) => {
   
    const [destination, setDestination] = useState("");
    const [number, setNumber] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [cvc, setCvc] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [formError, setFormError] = useState('');

    const reservationSchema = yup.object().shape({
      startDate: yup.date().required(),
      endDate: yup.date().required(),
      destination: yup.string().required(),
      amount: yup.number().moreThan(0).required(),
      cvc: yup.string().min(3).max(4).required(),
      exp_month: yup
        .number()
        .moreThan(0, "expiration month cannot be zero")
        .lessThan(13, "expiration month cannot be greater than 12")
        .required(),
      exp_year: yup
        .number()
        .moreThan(2022, "expiration year should not be less than 2022")
        .required(),
      cardNumber: yup.string().min(16).max(20).required(),
    });

    const handleCharge = (startDate, endDate) => {
      const FEE = 10;
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      
      const firstDate = startDate.getTime();
      const secondDate = endDate.getTime();
      
      const dateDiff = Math.ceil((secondDate - firstDate) /MS_PER_DAY); 
      const charge = dateDiff * FEE;
      
      return charge;
    }


    const handleDuration = (startDate, endDate) => {
      
      const MS_PER_DAY = 1000 * 60 * 60 * 24;

      const firstDate = startDate.getTime();
      const secondDate = endDate.getTime();

      const dateDiff = Math.ceil((secondDate - firstDate) / MS_PER_DAY);
      

      return dateDiff;
    };
    const charge = useMemo(
      () => handleCharge(startDate, endDate),[startDate, endDate]
    );

    const duration = useMemo(
      () => handleDuration(startDate, endDate),
      [startDate, endDate]
    );
  
  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  }

  const dateConverter = (startDate, endDate) => {
    const dateArray  = [new Date(startDate), new Date(endDate)];
    
    const convertedDate = [];
    for(let i = 0; i < dateArray.length ; i++ ){
        const year = dateArray[i].getFullYear();
        const month = padTo2Digits(dateArray[i].getMonth() + 1);
        const day = padTo2Digits(dateArray[i].getDate());

        const withHyphens = [month, day, year].join("-");
        
        convertedDate.push(withHyphens);
    }
    return convertedDate;
  }

  const dateForUpload = useMemo(
    () => dateConverter(startDate, endDate),
    [startDate, endDate]
  );
  
  


  const handleBilling = async(event) => {
    event.preventDefault();
    setFormError('');
    const data = {
      startDate: dateForUpload[0],
      endDate: dateForUpload[1],
      destination,
      amount: parseInt(charge),
      cvc,
      exp_month: parseInt(month),
      exp_year: parseInt(year),
      cardNumber: number,  
    };

    try {
      const isValid = await reservationSchema.validate(data);
      const dataUpload = {
        startDate: isValid.startDate,
        endDate: isValid.endDate,
        destination: isValid.destination,
        charge: {
          amount: isValid.amount,
          card: {
            cvc: isValid.cvc,
            exp_month: isValid.exp_month,
            exp_year: isValid.exp_year,
            number: isValid.cardNumber,
          },
        },
      };
      const response = await axios.post(
        "https://34.117.86.114/reservations/",
        dataUpload,
        { withCredentials: true }
      );
      if(response.status === 201){
        alert('Kindly check your email for order notification');
        setNavigate(true)
      }
      event.target.reset();
    } catch (error) {
        
        if(error.errors){
          setFormError(error.errors[0]);
          return
        }

       if (error.response.status === 403) {
        console.log(error);
         localStorage.removeItem("auth");
         setUser('')
         setNavigate(false);
         return
       }
        console.log(error);
        setFormError('check card credentials');
        return
    }
  }

  if (navigate) {
    return <Navigate to="/get-reservation" />;
  }

  return (
    <div className="container reservation">
      {user && (
        <main>
          <div className="form-signin text-center">
            <h2>Reservation {user}</h2>
          </div>
          <div className="py-5 text-center">
            <h3>Checkout form</h3>
          </div>

          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Your cart</span>
              </h4>
              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Vacation</h6>
                    <small className="text-body-secondary">Duration</small>
                  </div>
                  <span className="text-body-secondary">{duration} day(s)</span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (USD)</span>
                  <strong>${charge}</strong>
                </li>
              </ul>
            </div>
            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Reservation Details</h4>
              {formError && <p className="text-danger">{formError}</p>}

              <form className="needs-validation" onSubmit={handleBilling}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <DatePicker
                      id="startDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      minDate={new Date()}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">
                      End Date
                    </label>
                    <DatePicker
                      id="endDate"
                      showIcon
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      minDate={new Date()}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="room" className="form-label">
                      Select Destination spot
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option defaultValue="" >Select Destination</option>
                      <option value="Maldives">Maldives</option>
                      <option value="Seychelles">Seychelles</option>
                      <option value="Cape Verde">Cape Verde</option>
                    </select>
                  </div>
                </div>

                <hr className="my-4" />

                <h4 className="mb-3">Payment</h4>

                <div className="row gy-3">
                  <div className="col-md-6">
                    <label htmlFor="cc-number" className="form-label">
                      Credit card number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-number"
                      placeholder=""
                      required
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>

                  <div className="col-md-2">
                    <label htmlFor="cc-expiration" className="form-label">
                      Exp Month
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-expiration"
                      placeholder=""
                      required
                      onChange={(e) => setMonth(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Expiration date required
                    </div>
                  </div>

                  <div className="col-md-2">
                    <label htmlFor="cc-expiration" className="form-label">
                      Exp Year
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-expiration"
                      placeholder=""
                      required
                      onChange={(e) => setYear(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Expiration date required
                    </div>
                  </div>

                  <div className="col-md-2">
                    <label htmlFor="cc-cvv" className="form-label">
                      CVV/CVC
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cc-cvv"
                      placeholder=""
                      required
                      onChange={(e) => setCvc(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Security code required
                    </div>
                  </div>
                </div>
                <hr className="my-" />
                <button className="w-100 btn btn-primary btn-lg" type="submit">
                  Continue to checkout
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {!user && (
        <main>
          <div className="form-signin text-center">
            <h2>Log in to make your reservation</h2>
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
  );
};

export default Reservation;
