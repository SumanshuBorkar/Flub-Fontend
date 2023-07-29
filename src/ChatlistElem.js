import React, { useEffect, useState } from 'react';
import "./css/ChatlistEleme.css";
import GroupChatProfile from './images/group.png';

const getSender = (loggedUser, users, chatName) => {
  if (chatName !== "sender") {
    return chatName; // Return group name if it is a group chat
  } else if (users.length === 2 && users[0] && users[1]) {
    // Return the name of the other user (not logged in user) if it is not a group chat
    return users.find(user => user._id !== loggedUser._id)?.Name || "";
  } else {
    return ""; // Handle case when users array is empty or doesn't have required properties
  }
};

const getSenderProfile = (loggedUser, users, chatName) => {
  if (chatName !== "sender") {
    return GroupChatProfile;
  } else if (users.length === 2 && users[0] && users[1]) {
    // Return the profile of the other user (not logged in user) if it is not a group chat
    return users.find(user => user._id !== loggedUser._id)?.file.url || GroupChatProfile;
  } else {
    return GroupChatProfile; // Handle case when users array is empty or doesn't have required properties
  }
};

const ChatlistElem = ({ chat, loggedUser, handleFunction }) => {
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setFetching(false);
    setUsers(chat.users || []);
  }, [chat]);

  const sender = getSender(loggedUser, users, chat.chatName);
  const SenderProfile = getSenderProfile(loggedUser, users, chat.chatName);

  if (fetching) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="chatlisrelem" onClick={handleFunction}>
        <img className='profile-of-chatlist-user' src={SenderProfile} alt="this is me" />
        <div className="chatname">{sender || chat.chatName}</div>
      </div>
    );
  }
};

export default ChatlistElem;
export { getSender, getSenderProfile };
