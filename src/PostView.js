import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from './images/Flub.png';
import Setting from './images/Power.png'
import camera from './images/Camera.png';
import chat from './images/Chat.png'
import Profile from './images/Profile.png'
import './css/posts.css';
import Postcard from './postcard';
import { ChatState } from './Context/ChatProvider';
import { getSender } from './ChatlistElem';
const LoggedUser = JSON.parse(localStorage.getItem('user'));


function PostView () {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleNotification = () => {
  setIsDropdownOpen(!isDropdownOpen);
};


  const [data, setData] = useState( [] );
  const {notification, setNotification } = ChatState();

  useEffect( () => {

    let token = localStorage.getItem( 'token-user' );

    fetch( `https://flubbackend.onrender.com/posts/post`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    } )
      .then( res => res.json() )
      .then( responseData => {
        setData( responseData.reverse() );
      } )
      .catch( error => {
      } );
  }, [] );

  function ncard ( val ) {
    return (
      <Postcard
        key={val._id}
        imageUrl={val.file.url}
        description={val.description}
        likes={val.likes}
        name={val.author}
        location={val.location}
        date={val.date}
        postId={val._id}
        Poster={val.userId}
      />
    );
  }

  const hndleNotification=(val) => {

  }



  const navigate = useNavigate();
  const handPowerClick = () =>{
    localStorage.removeItem('user');
    localStorage.removeItem("token-user");
    localStorage.removeItem("user-id");
    localStorage.removeItem("selectedChat");
    navigate('/');
  }

  return (
    <>
      <div id="box">
        <div className="navbar">
          <img src={image} alt="not availabel" className='logo-ka-logo' />
          <div className="iconsofuses">
            <Link to='/private/newPosts' className='nplopo'>
              <img src={camera} alt="not available" className='camera' />
            </Link>
            <Link to='/private/chats' className='chats-of-chats'>
              <img src={chat} alt="not available" className='camera' />
            </Link>
            <Link to='/private/Profile' className='ProfilePagecomponent'>
              <img src={Profile} alt="not available" className='camera' />
            </Link>
            <div onClick={handPowerClick} className='ProfilePagecomponent'>
              <img src={Setting} alt="not available" className='camera' />
            </div>
          </div>
        </div>
        <div className="container-ka-container">
          {Array.isArray( data ) ? data.map( el => ncard( el ) ) : null}
        </div>
        <div className="bottomNavigation">
        <div className="Louse">
            <Link to='/private/newPosts' className='nplopo'>
              <img src={camera} alt="not available" className='camera' />
            </Link>
            <Link to='/private/chats' className='chats-of-chats'>
              <img src={chat} alt="not available" className='camera' />
            </Link>
            <Link to='/private/Profile' className='ProfilePagecomponent'>
              <img src={Profile} alt="not available" className='camera' />
            </Link>
            <div onClick={handPowerClick} className='ProfilePagecomponent'>
              <img src={Setting} alt="not available" className='camera' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostView;


