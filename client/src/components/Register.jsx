import React, { useState } from 'react'
import '../assets/styles/Register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

function Register() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFormSubmitRegister = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.post('https://assignment-manager-1.onrender.com/user/register', { username, email, password }, { withCredentials: true });

      if (response.status === 201) {
        // alert("Registered successfully! You can now Log in.");
        Swal.fire("User registered successfully! You can now Log in.!");
        navigate('/Login');
      }
      // else if (response.status === 401) {
      //   alert("User already registered, Please Log in.");
      // }

    } catch (err) {
      // alert(`Error:- ${err.message}`);
      if (err.response && err.response.status === 401) {
        alert(err.response.data.message || "An error occured.");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  }

  return (
    <>
      <div className="register-body">
        <div className="register-container">
          <h3>Register</h3>
          <form onSubmit={handleFormSubmitRegister} className='register-form'>
            <input type="text" placeholder='username' id='username-input'
              onChange={(e) => { setUsername(e.target.value) }} required='true' autoComplete='off' />
            <input type="text" required="true" placeholder='email' id='email-input'
              onChange={(e) => { setEmail(e.target.value) }} autoComplete='off' />
            <input type="password" required="true" name="" id="password-input" placeholder='password'
              onChange={(e) => { setPassword(e.target.value) }} autoComplete='off' />
            <button type="submit" className='submit-button-register'>Register</button>
          </form>
          <p id='already-have-an-account'>Already have an account? <Link id='link-login' to='/Login'>Log in</Link></p>
          <Link to='/' id='back-to-home-from-register'>Back to Home</Link>
        </div>
      </div>
    </>
  )
}

export default Register
