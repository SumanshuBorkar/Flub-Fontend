import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import './css/ProfilePageEdit.css';
import { ClipLoader } from 'react-spinners';

function ProfileEdit ( { clickclose } ) {

  const [image, setImage] = useState( '' );
  const [loder, setloder] = useState(false)
  const [Bio, setBio] = useState( '' );
  const uxxx = localStorage.getItem( 'user-id' );
  const key = uxxx.slice( 1, uxxx.length - 1 )


  const handleSubmitOFEDIT = async ( e ) => {
    e.preventDefault();
    setloder(true)
    const formData = new FormData(e.target);
    formData.append( "Bio", Bio );
    formData.append( "userId", key );
    // formData.append( "file", image );


    await fetch( `https://flubbackend.onrender.com/user/Edit`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem( "token-user" )}`,
      },
      body: formData,
    } )
      .then( ( res ) => res.json() )
      .then( ( res ) => {
        console.log(res);
        localStorage.setItem( "user", JSON.stringify( res ) );
        clickclose();
      } )
      .catch( ( error ) => {
        // Handle any error that occurred during the request
        toast.error(error);
      } );

    // clear form inputs
    setloder(false);
    setBio( '' );
    setImage( '' );
  };


  return (
    <>
      <div className="editComponent">
        <h2>Edit Profile</h2>
        <form className='formEditoooo' onSubmit={handleSubmitOFEDIT} encType="multipart/form-data"  >

          <div className="Bio">
            <label htmlFor="Bio">Bio</label>
            <div><input type="text" id="Bio" className='BioSection' value={Bio} onChange={( e ) => setBio( e.target.value )} /></div>
          </div>

          <div className="pROFILE">
            <label htmlFor="image">Image:</label>
            <div><input type="file" id="image" name='file' onChange={( e ) => setImage( e.target.files[0] )} /></div>
          </div>

          <button type="submit" className='button-50'>{loder?<div id="loder-of-the-button-of-the-login-submit"><ClipLoader size={16} color="#ffff" loading={true} /></div>:"Register"}</button>
          <button className='CloseButton' onClick={clickclose}>Close</button>
        </form>
      </div>

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

    </>
  )
}

export default ProfileEdit


