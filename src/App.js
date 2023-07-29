import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PostView from './PostView';
import NewPost from './newPost';
import UserLogin from './UserLogin';
import UserSign from './UserSignin';
import './App.css';
import PrivetRoute from './PrivetRoute';
import ErrorPage from './ErrorPage';
import Comment from './Comment';
import ChatPage from './ChatPage';
import ChatProvider from './Context/ChatProvider';
import ChatBox from './ChatBox';
import ProfilePage from './ProfilePage';
import OthersProfilePage from './OthersProfilePage';

function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<UserLogin/>} />
            <Route path="/signin" element={<UserSign/>} />
            <Route path="/private" element={<PrivetRoute/>} />
            <Route path="/private/post" element={<PostView/>} />
            <Route path="/private/newPosts" element={<NewPost/>} />
            <Route path="/private/chats" element={<ChatPage/>} />
            <Route path="/private/chatBox" element={<ChatBox/>}/>
            <Route path="/private/Profile" element={<ProfilePage/>} />
            <Route path="/comment" element={<Comment/>} />
            <Route path="/OthersProfilePage" element={<OthersProfilePage/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
