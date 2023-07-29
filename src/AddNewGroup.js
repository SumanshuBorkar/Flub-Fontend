import React, { useState } from 'react';
import { ChatState } from './Context/ChatProvider';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { toast } from 'react-toastify';
import UserBadgeItem from './UserBadgeItem';
import './css/AddNewGroup.css'

function AddNewGroup({clickclose}) {
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    if (!query) return;

    try {
      setLoading(true);
      let token = localStorage.getItem('token-user');

      await fetch(`https://flubbackend.onrender.com/user/users?search=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
        },
      })
        .then((res) => res.json())
        .then(async (responseData) => {
          setSearchResult(responseData);
          setLoading(false);
        })
        .catch((error) => {
          // console.error('Error fetching data:', error);
        });
    } catch (err) {}
  };

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers){
        toast.error("Please fill all the fields")
    }
    try {

        let token = localStorage.getItem('token-user');

        await fetch("https://flubbackend.onrender.com/chat/group", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
          },
          body: JSON.stringify({
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u)=> u._id)),
          }),
        })
          .then((res) => res.json())
          .then(async (responseData) => {
            setChats([responseData, ...chats]);
          });
          clickclose();
      } catch (err) {
        toast.error(err);
      }
}

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast.error('User already exists in the group');
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
    closetheshutter();
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const closetheshutter = () => {
    setSearchResult( [] );
  }

  return (
    <div className='boxcomt'>
      <div className="create-new-group-form">
        <h1>Create new Group</h1>
        <input className='inputofcreategrp' type="text" placeholder="Group Name" onChange={(e) => setGroupChatName(e.target.value)} />
        <input className='inputofcreategrp' type="text" placeholder="Add User eg: John Doe" onChange={(e) => handleSearch(e.target.value)} />
        <button className='closecreategroupchat' onClick={handleSubmit}>Create Chat</button>
        <button className='closecreategroupchat100' onClick={clickclose}>close</button>
        <div className="userBadgeItems">
          {selectedUsers.map((e) => (
            <UserBadgeItem key={e._id} user={e} handleFunction={() => handleDelete(e)} />
          ))}
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
    </div>
  );
}


export default AddNewGroup;
