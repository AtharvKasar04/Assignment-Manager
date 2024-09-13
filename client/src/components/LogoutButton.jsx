import React from 'react'

function LogoutButton() {

    const userLogout = () => {
        
    }

  return (
    <>
        <div className="logoutButtonContainer">
            <button id='logoutButton' onClick={userLogout}>Logout</button>
        </div>
    </>
  )
}

export default LogoutButton
