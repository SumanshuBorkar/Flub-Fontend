import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserListItem from './UserListItem';
import {ChatState} from './../src/Context/ChatProvider';

import ChatLoading from './ChatLoading';
import './css/SideDrawer.css';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState()
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef(null);
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSearch = async () => {
    if (!search) {
      toast.error('Enter something in the search box');
      return;
    }

    setLoading(true);
    let token = localStorage.getItem('token-user');

    await fetch(`https://flubbackend.onrender.com/user/users?search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
      },
      
    })
      .then((res) => res.json())
      .then(async(responseData) => {
        setSearchResult(responseData);
        setLoading(false);
        setIsSearchOpen(true);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
      });
  };

  const accessChat = (userId) => {
    setIsSearchOpen(false);
    try{
        setLoadingChat(true);

      let token = localStorage.getItem('token-user');

      fetch(`https://flubbackend.onrender.com/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
      },
      body:JSON.stringify({userId})
    })
    .then((res) => res.json())
    .then((responseData) => {
  
      if (!chats.find((c) => c._id === responseData._id)) setChats([responseData, ...chats]);
      setSelectedChat(responseData);
      setLoadingChat(false);
    })

    setLoadingChat(false);

    }catch(e) {
      toast.error(`${e}`);
    }
  };

  return (
    <div className='outermostcontainerinsidedrawer'>
      <div className="container-of-search">
        <input
          type="text"
          placeholder="Search By Name or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='inputofmychatsearch'
        />
        <button className="button-505" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className={`search-container-below-search ${isSearchOpen ? 'open' : ''}`} ref={containerRef}>
        <div className="scroll">
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult.length > 0 ? (
            searchResult.map((User) => (
              <UserListItem key={User._id} user={User} handleFunction={() => accessChat(User._id)} />
            ))
          ) : (
            <p>No such user available.</p>
          )
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
    </div>
  );
}

export default SideDrawer;

