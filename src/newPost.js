import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import './css/form.css'
import { ClipLoader } from 'react-spinners';
const NewPostForm = () => {
  const [loder, setloder] = useState(false)
  const navigate = useNavigate();
  const [location, setLocation] = useState( '' );
  const [description, setDescription] = useState( '' );
  const [image, setImage] = useState( '' );

  const handleSubmit =async ( e ) => {
    e.preventDefault();
    setloder(true)
    const data = new FormData(e.target);
    data.append('userID', localStorage.getItem('user-id'));
    data.append('likes', []);
    data.append('description', description);
    data.append('location', location);
    

    await fetch( `https://flubbackend.onrender.com/posts/post`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem( "token-user" )}`
      },
      body: data 
    } )

      .then( res => {
        if ( res.ok )
        {
          return res.json();
        } else
        {
          throw new Error( "Error: Data could not be received by the server." );
        }
      } )
      .then( res => {
        // Handle the successful response here
      } )
      .catch( error => {
        // Handle any error that occurred during the request
        // console.error( "Error:", error );
      } );


    // clear form inputs
    setloder(false);
    setLocation( '' );
    setDescription( '' );
    setImage( '' );
    navigate( "/private/Post" )
  }
  

  return (
    <div className='contain-the-form'>
      <form onSubmit={handleSubmit} id='Form-to-submit' encType="multipart/form-data">

        <div className="location">
          <label htmlFor="location">Location:</label>
          <div><input type="text" id="location" value={location} onChange={( e ) => setLocation( e.target.value )} /></div>
        </div>

        <div className="description">
          <label htmlFor="description">Captions:</label>
          <div><textarea id="description" value={description} onChange={( e ) => setDescription( e.target.value )} /></div>
        </div>

        <div className="img-submit">
          <label htmlFor="image">Image:</label>
          <div><input type="file" id="image" name='file' onChange={( e ) => setImage( e.target.files[0] )} /></div>
        </div>

        <button type="submit" className='button-50'>{loder?<div id= "loder-of-the-button-of-the-login-submit"><ClipLoader size={16} color="#ffff" loading={true} /></div> :"Submit"}</button>
      </form>
    </div>
  );
}

export default NewPostForm;



