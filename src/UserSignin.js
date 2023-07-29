import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import "./css/Signin.css";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function UserSign () {

  const [loder , setLoder] = useState(false);
  const [Email, setEmail] = useState( '' );
  const [Name, setName] = useState( '' );
  const [Password, setPassword] = useState( '' );
  const [confirmPassword, setConfirmPassword] = useState( '' );
  const [image, setImage] = useState( '' );

const [err, setErr]= useState("")

  const navigate = useNavigate();
  const onSubmitData = async ( e ) => {
    setLoder(true);
    e.preventDefault();

    const data = new FormData(e.target);
    data.append('Name', Name);
    data.append('email', Email);
    data.append('password', Password);
    data.append('Confirm_Password', confirmPassword);
    
    if ( Email === "" )
    {
      toast.error( "Email is required" );
    }
    else if ( Name === "" )
    {
      toast.error( "Enter Valid Email !" )
    }
    else if ( !Email.includes( "@" ) )
    {
      toast.error( "Enter Valid Email !" )
    }
    else if ( Password === "" )
    {
      toast.error( "Password is required" )
    }
    else if ( Password.length < 4 )
    {
      toast.error( "password is too short" )
    }
    else if ( Password.length > 10 )
    {
      toast.error( "password is too Long" )
    }
    else if ( confirmPassword !== Password )
    {
      toast.error( "password is not Matching" )
    }
    else if ( image === null )
    {
      toast.error( "cannot go ahead without a profile image!!!" )
    }
    else
    {
      setLoder(true);
      await fetch( `https://flubbackend.onrender.com/user/signup`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem( "token-user" )}`
      },
      body: data 
    } )
    .then(res => res.json())
    .then(data=>{
        if(data.status==="Failed"){
          setErr("User Email Id Allready Exists")
          setLoder(false)
        }else if(data.status==="Success"){
          toast.success("Register Successfully");
          setLoder(false)
          setErr("")
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setImage("");
          navigate('/');
        }
      });
 
 }

}

  return (
    <>
      <div className="container-of-login-form-in-my-side" id='form' >
      
        <form onSubmit={onSubmitData} id='form-of-signin' encType="multipart/form-data">
        <h4 className='fom-name-in-login-form'>Resister Your Account</h4>
        <h6 style={{color:"red"}}>{err}</h6>
          <input type="text" name="Name" className='login-admin-the-css-for-form height-of-box' placeholder='UserName'  value={Name} onChange={( e ) => setName( e.target.value )}/>

          <input type="email" name="email" className='login-admin-the-css-for-form height-of-box'  placeholder='Email' value={Email} onChange={( e ) => setEmail( e.target.value )} />

          <input type="password" className='login-admin-the-css-for-form height-of-box' onChange={( e ) => setPassword( e.target.value )} placeholder='password' name='password' value={Password} />

          <input type="password" className='login-admin-the-css-for-form height-of-box' onChange={( e ) => setConfirmPassword( e.target.value )} placeholder='Confirm Password' name='Confirm_Password' value={confirmPassword}/>

          <input type="file" className='login-admin-the-css-for-form height-of-box' name='file' onChange={( e ) => setImage( e.target.files[0] )} />

          <div id="button-container-in-admin-login-page"> <button type='submit' id="button-container-in-admin-login-page-btn" className='button-50' >{loder?<div id="loder-of-the-button-of-the-login-submit"><ClipLoader size={16} color="#ffff" loading={true} /></div>:"Register"}</button></div>

        </form>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          theme="light"
        />
      </div>
    </>
  )
}

export default UserSign


