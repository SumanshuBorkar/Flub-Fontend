import React, { useState, useEffect } from 'react';
import './css/postcard.css';
import heart from './images/whiteHeart.png';
import heartRed from './images/redHeart.png';
import send from './images/cmnt.png';
import info from './images/ice.png';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';

const Postcard = ( { imageUrl, description, likes, name, location, date, postId, Poster } ) => {
  const [postLikes, setPostLikes] = useState( likes );
  const [isLiked, setIsLiked] = useState( false );
  const [showComment, setShowComment] = useState( false );
  const [DpOfUser, setDpOfUser] = useState("");

  useEffect( () => {
    let token = localStorage.getItem( "token-user" );
    fetch( `https://flubbackend.onrender.com/user/gUser/${Poster}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
      }
    } )
      .then( ( res ) => res.json() )
      .then( ( responseData ) => {
        setDpOfUser(responseData.file.url);
      } );

  }, [Poster] );

  useEffect( () => {
    if ( postLikes.includes( localStorage.getItem( 'user-id' ) ) )
    {
      setIsLiked( true );
    }
  }, [postLikes] );


  const handleHeartClick = async () => {
    try
    {
      await fetch( `https://flubbackend.onrender.com/posts/post/like/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem( 'token-user' )}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { userId: localStorage.getItem( 'user-id' ) } )
      } );

      const updatedLikes = postLikes.includes( localStorage.getItem( 'user-id' ) )
        ? postLikes.filter( ( id ) => id !== localStorage.getItem( 'user-id' ) )
        : [...postLikes, localStorage.getItem( 'user-id' )];

      setPostLikes( updatedLikes );
      setIsLiked( !isLiked );
    } catch ( error )
    {
     
    }
  };

  const navigate = useNavigate();
  const handleProfileClick = () => {
    // Redirect to OthersProfilePage and pass the Poster data as a prop
    navigate( '/OthersProfilePage', { state: { Poster } } );
  };

  const handleCommentClick = () => {
    setShowComment( !showComment ); // Toggle the showComment state
  };


  return (
    <div className="post-card">
      <div className="card-header">
        <img className="profile-photo" onClick={handleProfileClick} src={DpOfUser} alt="" />
        <div className="left-header">
          <div className="name-acc">{name}</div>
          <div className="location-acc">{location}</div>
        </div>
        <div className="right-header">
          <img src={info} alt="this is a logo" />
        </div>
      </div>
      <div className="img-container">
        <img src={imageUrl} alt={description} className="post-image" />
      </div>
      <div className="post-info">
        <div className="like-send-comment">
          <span>
            <img
              src={isLiked ? heartRed : heart}
              onClick={handleHeartClick}
              className="heart-like"
              alt="heart is not heart"
            />
          </span>
          <span>
            <img src={send} alt="comment is not comment"
              className="heart-like"
              onClick={handleCommentClick}
            />
          </span>
          <span className="date-of-post">{date}</span>
        </div>
        <div className='likes-lis'>{postLikes.length} Dinglebops 🫀</div>
        <div className="comment-likkes">
          <div>{description}</div>
        </div>
      </div>
      {showComment && <Comment postId={postId} />}
    </div>
  );
};

export default Postcard;
