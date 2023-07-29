import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(() => {
    // Retrieve selected chat from local storage or set as initial state
    const storedSelectedChat = JSON.parse(localStorage.getItem('selectedChat'));
    return storedSelectedChat || null;
  });
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setUser(userInfo);

    if (!userInfo) {
      navigate('/');
    }
  }, [navigate]);

  // Update selectedChat in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedChat', JSON.stringify(selectedChat));
  }, [selectedChat]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

