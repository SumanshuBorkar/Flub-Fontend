import React, { useEffect, useState } from 'react'
import './css/ProfilePage.css'
import { useLocation } from 'react-router-dom';
import Postcard from './postcard';


const OthersProfilePage = () => {
  const location = useLocation();
  const Poster = location.state?.Poster; // Use optional chaining to handle undefined state

  const [userPosts, setUserPosts] = useState( [] );
  const [Name, setName] = useState( "" );
  const [Bio, setBio] = useState("");
  const [Followers, setFollowers] = useState( [] );
  const [Following, setFollowing] = useState( [] );
  const [UserDp, setUserDp] = useState( '' );
  let token = localStorage.getItem( 'token-user' );
  let user = localStorage.getItem( 'user' );
  let Ied = localStorage.getItem( 'user-id' ).slice( 1, localStorage.getItem( 'user-id' ).length - 1 );

  useEffect( () => {
    if ( Poster )
    {

      fetch( `https://flubbackend.onrender.com/posts/post/userposts/${Poster}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
        }
      } )
        .then( ( res ) => res.json() )
        .then( ( responseData ) => {
          setUserPosts( responseData.reverse() );
        } );

      fetch( `https://flubbackend.onrender.com/user/gUser/${Poster}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
        }
      } )
        .then( ( res ) => res.json() )
        .then( ( responseData ) => {
          setBio( responseData.Bio );
          setName( responseData.Name );
          setUserDp( responseData.file.url );
          setFollowers( responseData.Followers );
          setFollowing( responseData.Following );
        } );
    }
  }, [Poster, token] );

  const Followtheuser = () => {
    fetch( `https://flubbackend.onrender.com/user/gUser/${Poster}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
      },
      body: user
    } )
      .then( ( res ) => res.json() )
      .then( ( responseData ) => {
        setFollowers( responseData.Followers );
        setFollowing( responseData.Following );
      } );
  }

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


  return (
    <div className="profilepagecontainer">
      <div className="profile111Container">
        <div className="userNameIndicator">
          <h2 className="User1111">
            {Name}
          </h2>
        </div>
        <div className="profileimagepostsfollowersfollowingcontainer">
          <img className='ProfileImage44' src={UserDp} alt="this is the profilepage" />
          <div className="Posts">
            <h1 className="indicatorsofPFF">{userPosts.length}</h1>
            <p>Posts</p>
          </div>
          <div className="Followers">
            <h1 className="indicatorsofPFF">{Followers.length}</h1>
            <p>Admirers</p>
          </div>
          <div className="Following">
            <h1 className="indicatorsofPFF">{Following.length}</h1>
            <p>Admire</p>
          </div>
        </div>
        <div className="BioIndicator11">
          <p className='bio'>{Bio}</p>
        </div>
        <div className="ButtoonComponent">
          <button
            className={`ProfilePageButtons ${Followers.includes( Ied ) ? 'red-button' : ''}`}
            onClick={Followtheuser}
          >
            {Followers.includes( Ied ) ? 'Stop Admiring' : 'Admire'}
          </button>
        </div>
        <div className="postsOfUserContainer">
          {Array.isArray( userPosts ) ? userPosts.map( el => ncard( el ) ) : null}
        </div>
      </div>
    </div>
  )
}

export default OthersProfilePage