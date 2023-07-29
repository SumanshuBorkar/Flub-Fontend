import React, { useEffect, useState } from 'react';
import SideDrawer from './SideDrawer';
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from './Context/ChatProvider';
import ChatLoading from './ChatLoading';
import ChatlistElem from './ChatlistElem';
import AddNewGroup from './AddNewGroup';
import { useNavigate } from 'react-router-dom';
import "./../src/css/ChatPage.css"

function ChatPage() {
  const navigate = useNavigate()
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain
  } = ChatState();
  const [showAddGroup, setShowAddGroup] = useState(false);

  const fetchChat = async () => {
    let token = localStorage.getItem('token-user');

    try {
      const response = await fetch(`https://flubbackend.onrender.com/chat/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setChats(responseData);
      } else {
        throw new Error('Error fetching chat data');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('user')));
    fetchChat();
  }, [fetchAgain]);

  const handleAddGroupClick = () => {
    setShowAddGroup(true);
  };

  const handleBackdropClick = () => {
    setShowAddGroup(false);
  };

  const handleChatListClick = (chat) => {
    setSelectedChat(chat)
    navigate("/private/chatBox");
  }

  return (
    <div className='This-is-the-boss-of-chat-page'>
      <SideDrawer />
      <div className='chat-show-list'>
        <h1 className='mychatslogo'>My Chats</h1>
        <button className='addgroupchactbutton' onClick={handleAddGroupClick}>New Group Chat +</button>
      </div>
      <div className="chat-list-inner-lower">
        {chats ? (
          chats.length > 0 ? (
            chats.map((chat) => (
              <ChatlistElem
                key={chat._id}
                chat={chat}
                loggedUser={loggedUser}
                handleFunction={() => handleChatListClick(chat)} // Pass chat directly to the function
              />
            ))
          ) : (
            <p>No chats yet</p>
          )
        ) : (
          <ChatLoading />
        )}
      </div>
      <div className="addnewgrpcathpopup">
      {showAddGroup && (
        <>
          <div className="backdrop" onClick={handleBackdropClick} />
          <AddNewGroup clickclose={handleBackdropClick}/>
        </>
      )}
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
    </div>
  );
}

export default ChatPage;
