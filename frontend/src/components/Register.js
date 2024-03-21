import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {

    event.preventDefault();

    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const result = await res.json()

    if (result.error) {
      console.log("Error Loading Page");
    }
    else {
      
      if (result.body.exists === true) {
        console.log("Email Already exists");
        toast(result.body.exists);
      }
      else if (result.body.valid === true) {
        console.log(`${email} registered Succesfully`);
        toast(result.body.message);
        setTimeout(() => { navigate('/login') }, 3000);
      }
      else {
        toast(result.body.message);
        navigate('/register');
      }

    }

  };

  return (
    <>

      <div className="formContainer">
        <form id='regForm' method='POST' onSubmit={handleSubmit} >
          <h1>Registration Form</h1>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Your Password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <small id="emailHelp" className="form-text">Password must contain atleast 1 Uppercase , 1 LowerCase, 1 Digit, 1 Special Character</small>
          </div>

          <div className="form-group" id='signInwithGoogle'>
            <button type="submit" className="btn btn-primary" id='regSubmit'>Submit</button>
          </div>

        </form>

      </div>

      <ToastContainer />

    </>
  )

}