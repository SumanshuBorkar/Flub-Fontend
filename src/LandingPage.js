import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import image from './images/Flub.png'
import './css/landing.css'
function LandingPage() {

  useEffect(()=>{

    localStorage.setItem("user" , JSON.stringify({
      "_id": "64bdd9b1b5d01da40f9c8d95",
      "Name": "LoginUser",
      "email": "LoginUser@gmail.com",
      "Bio": "",
      "Following": [],
    })
    
    );

  })

  return (
    <>
    <div className='landingcard'>
      <img src={image} alt="image not available"  className='this-is-the-landing'/>
      <Link to='/signin'><button className='button-501'>SignIn</button></Link>
      <Link to='/login'><button className='button-501'>Login</button></Link>
    </div>
    </>
  )
}

export default LandingPage
