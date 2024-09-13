import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../assets/styles/Login.css'
import axios from 'axios';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleFormSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            let response = await axios.post("http://localhost:5000/user/login", { email, password }, { withCredentials: true });

            if (response.status === 200) {
                navigate("/user-assignments");
            }

        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert(err.response.data.message || "An error occured.")
            }
            else if (err.response && err.response.status === 404) {
                alert(err.response.data.message || "An error occured");
                navigate("/Register");
            } else {
                alert(`Error: ${err.message}`)
            }
        }
    }

    return (
        <>
            <div className="login-body">
                <div className="login-container">
                    <h3>Login</h3>
                    <form onSubmit={handleFormSubmitLogin} className='login-form'>
                        <input type="text" placeholder='email' id='email-input'
                            onChange={(e) => { setEmail(e.target.value) }} autoComplete='off' required="true"/>
                        <input type="password" name="" id="password-input" placeholder='password'
                            onChange={(e) => { setPassword(e.target.value) }} autoComplete='off' required="true"/>
                        <button type="submit" className='submit-button-login'>Log in</button>
                    </form>
                    <p id='dont-have-an-account'>Don't have an account? <Link to='/Register' id='link-register'>Register</Link> </p>
                    <Link to='/' id='back-to-home-from-login'>Back to Home</Link>
                </div>
            </div>
        </>
    )
}

export default Login
