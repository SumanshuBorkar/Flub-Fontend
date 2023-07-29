import React from 'react';
import './css/Serch-tab-user.css';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div className="user-list-item" onClick={handleFunction}>
      <img className="user-image" src={user.file.url} alt="Profile" />
      {user.Name && <p className="user-name">{user.Name}</p>}
    </div>
  );
};

export default UserListItem;

