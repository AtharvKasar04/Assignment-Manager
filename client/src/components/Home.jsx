import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/styles/Home.css'

function Home() {
  return (
    <>
      <div className="home-body">
        <div className="container">
          <h1 className='heading'>Welcome to Assignment Manager</h1>
          <p className='infoPara'>Organize, Track, and Complete Your Assignments</p>
          <div className="buttons">
            <Link to='/Login' className='button-links button-link-login'>Login</Link>
            <Link to='/Register' className='button-links'>Register</Link>
          </div>
        </div>

        <div className="madeBy">
          <p>Made by <span id='name'>Atharv Kasar</span></p>
        </div>
      </div>
    </>
  )
}

export default Home
