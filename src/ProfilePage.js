import React, { useEffect, useState } from 'react'
import './css/ProfilePage.css'
import Postcard from './postcard';
import ProfilePageEdit from './ProfileEdit'


const ProfilePage = () => {

    const [userPosts, setUserPosts] = useState( [] );
    const [showEditForm, setShowEditForm] = useState( false );
    const User = JSON.parse( localStorage.getItem( 'user' ) );
    const loggedUser01 = localStorage.getItem( 'user-id' )
    const key = loggedUser01.slice( 1, loggedUser01.length - 1 )
    useEffect( () => {

        let token = localStorage.getItem( 'token-user' );
        fetch( `https://flubbackend.onrender.com/posts/post/userposts/${key}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
            }
        } )
            .then( ( res ) => res.json() )
            .then( ( responseData ) => {
                setUserPosts( responseData.reverse());
            } );

    }, [] )

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

    const handelEditform = () => {
        setShowEditForm( true );
    }

    const handlecloseForm = () => {
        setShowEditForm( false );
    }

    return (
        <div className="profilepagecontainer">
            <div className="profile111Container">
                <div className="userNameIndicator">
                    <h2 className="User1111">
                        {User.Name}
                    </h2>
                </div>
                <div className="profileimagepostsfollowersfollowingcontainer">
                    <img className='ProfileImage44' src={User.file.url} alt="this is the profilepage" />
                    <div className="Posts">
                        <h1 className="indicatorsofPFF">{userPosts.length}</h1>
                        <p>Posts</p>
                    </div>
                    <div className="Followers">
                        <h1 className="indicatorsofPFF">{User.Followers.length}</h1>
                        <p>Admirers</p>
                    </div>
                    <div className="Following">
                        <h1 className="indicatorsofPFF">{User.Following.length}</h1>
                        <p>Admire</p>
                    </div>
                </div>
                <div className="BioIndicator11">
                    <p className='bio'>{User.Bio}</p>
                </div>
                <div className="ButtoonComponent">
                    <button className="ProfilePageButtons" onClick={handelEditform}>
                        Edit Profile
                    </button>
                </div>
                <div className="postsOfUserContainer">
                    {Array.isArray( userPosts ) ? userPosts.map( el => ncard( el ) ) : null}
                </div>
            </div>
            <div className="Edit-popup">
                {showEditForm && (
                    <>
                        <ProfilePageEdit clickclose={handlecloseForm } />
                    </>
                )}
            </div>
        </div>
    )
}

export default ProfilePage