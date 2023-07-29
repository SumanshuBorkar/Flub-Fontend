import React, { useState } from 'react';
import { ChatState } from './Context/ChatProvider';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { toast } from 'react-toastify';
import UserBadgeItem from './UserBadgeItem';
import { ToastContainer } from 'react-toastify';
import './css/ChatInfo.css';

function ChatInfo ({toggle}) {
  const [groupChatName, setGroupChatName] = useState( '' );
  const [searchResult, setSearchResult] = useState( [] );
  const [loading, setLoading] = useState( false );

  const { selectedChat, user } = ChatState();
  const [selectedUsers, setSelectedUsers] = useState( selectedChat.users );
  const Loggeduser = localStorage.getItem("user-id").slice(1, localStorage.getItem("user-id").length-1);

  const handleSearch = async ( query ) => {
    if ( !query ) return;

    try
    {
      setLoading( true );
      let token = localStorage.getItem( 'token-user' );

      await fetch( `https://flubbackend.onrender.com/user/users?search=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
        },
      } )
        .then( ( res ) => res.json() )
        .then( async ( responseData ) => {
          setSearchResult( responseData );
          setLoading( false );
        } )
        .catch( ( error ) => {
          // console.error( 'Error fetching data:', error );
        } );
    } catch ( err ) { }
  };

  const closetheshutter = () => {
    setSearchResult( [] );
  }

  const handleSubmit = async () => {
    try
    {
      if ( !groupChatName )
      {
        // If the groupChatName is empty, use the previous name of the group
        setGroupChatName( selectedChat.chatName );
        return; // Return early to prevent the API call
      }

      let token = localStorage.getItem( 'token-user' );

      if ( !selectedChat.groupAdmin._id === user._id )
      {
        toast.error( 'Only the admin can add or remove users' );
        return;
      }

      const updatedChat = {
        chatId: selectedChat._id,
        chatName: groupChatName,
        users: selectedUsers,
      };

      await fetch( 'https://flubbackend.onrender.com/chat/rename', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token.slice( 1, token.length - 1 )}`,
        },
        body: JSON.stringify( updatedChat ),
      } )
        .then( ( res ) => res.json() )
        .then( async ( responseData ) => {
          toast.success( 'Group chat updated successfully' );
        } );
    } catch ( err )
    {
      toast.error( err );
    }

    toggle();

  };


  const handleGroup = ( user ) => {
    
    if(selectedChat.groupAdmin.id !== Loggeduser ){
      toast.error("Only Admin can Add or remove users from the group");
      return;
    }

    if ( selectedUsers.includes( user ) )
    {
      toast.error( 'User already exists in the group' );
    } else
    {
      setSelectedUsers( [...selectedUsers, user] );
    }

    closetheshutter();

  };

  const handleDelete = ( user ) => {

    if(selectedChat.groupAdmin.id !== Loggeduser ){
      toast.error("Only Admin can Add or remove users from the group");
      return;
    }

    setSelectedUsers( selectedUsers.filter( ( u ) => u._id !== user._id ) );
  };

  return (
    <>
      <div className="create-new-group-form6543">
        <h1>Update Group</h1>
        <input
          type="text"
          className='inputofgrp'
          placeholder="Group Name"
          value={groupChatName}
          onChange={( e ) => setGroupChatName( e.target.value )}
        />
        <input type="text" className='inputofgrp' placeholder="Add User eg: John Doe" onChange={( e ) => handleSearch( e.target.value )} />
        <button className='createGroupButton' onClick={handleSubmit}>Update Changes</button>
        <div className="userBadgeItems">
          {selectedUsers.map( ( e ) => (
            <UserBadgeItem key={e._id} user={e} handleFunction={() => handleDelete( e )} />
          ) )}
        </div>
        <div className="containerforserachresults" style={{ display: searchResult.length === 0 ? "none" : "block" }}>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.slice( 0, 4 ).map( ( user ) => (
              <UserListItem key={user._id} user={user} handleFunction={() => handleGroup( user )} />
            ) )
          )}
        </div>

      </div>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        theme="dark"
      />
    </>
  );
}

export default ChatInfo;
