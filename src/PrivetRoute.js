import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const isLoggedin = () => {
    let data = localStorage.getItem('token-user');
    if(data != null) return true;
    else return false; // Use double negation to convert the value to a boolean
  };

  return isLoggedin() ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoute;


