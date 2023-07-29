import React, { useEffect, useState } from 'react';
import { ChatState } from './Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { getSender, getSenderProfile } from './ChatlistElem';
import ChatInfo from './ChatInfo';
import Loading from './ChatLoading'
import "./css/Chatbox.css";
import ScrolableChat from './ScrolableChat';
import io from "socket.io-client";
const ENDPOINT = "https://flubbackend.onrender.com";
var socket , selectedChatCompare;


function ChatBox() {
  const {user, selectedChat, notification, setNotification, fetchAgain, setFetchAgain } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState([]);
  const [showChatInfo, setShowChatInfo] = useState(false); // State to control the visibility of ChatInfo component
  const [Message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false)
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);


  useEffect(() => {
    socket = io(ENDPOINT);
  
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", () => setsocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [user]);
  

  useEffect(() => {
    fetchMessages(); 
    setFetching(false);
    setLoggedUser(JSON.parse(localStorage.getItem('user')));
    setUsers(selectedChat?.users || []);

    selectedChatCompare = selectedChat;

  }, [selectedChat]);


  useEffect(()=>{
    socket.on("message recieved", (newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        if(!notification.includes(newMessageReceived)){
          setNotification(newMessageReceived, ...notification);
          setFetchAgain(!fetchAgain);
        }
      }
      else{
        setMessage([...Message, newMessageReceived]);    
      }
    })
  })

  const navigate = useNavigate();
  const backbutton = () => {
    navigate(-1);
  };

  const chatName = selectedChat?.chatName || '';
  const sender = getSender(loggedUser, users, chatName);
  const senderProfile = getSenderProfile(loggedUser, users, chatName)

  const toggleChatInfo = () => {
    setShowChatInfo(!showChatInfo); // Toggle the visibility of ChatInfo component
  };

  const typeHandelling = (e) => {
     setNewMessage(e.target.value)

     // typing indicator logic
     if(!socketConnected) return;

     if(!typing){
      setTyping(true);
      socket.emit("typing", selectedChat._id);
     }
     let lastTypingTime = new Date().getTime();
     var timerLength = 2000;
     setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
     }, timerLength)
  } 

  const sendMessage= async () => {
    socket.emit("stop typing", selectedChat._id);
    try{
      
      const updatedChat = {
        chatId: selectedChat._id,
        content: newMessage 
      };

      setNewMessage("");

    let token = localStorage.getItem('token-user');

    await fetch(`https://flubbackend.onrender.com/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
      },
      body: JSON.stringify(updatedChat)
    })
      .then((res) => res.json())
      .then(async (responseData) => {

        socket.emit("new message", responseData)
        setMessage([...Message, responseData]);
      })
      .catch((error) => {
        // console.error('Error Posting data:', error);
      });
  } catch (err) {}
  }

  const fetchMessages = async () => {
     if(!selectedChat) return;
     try{
      let token = localStorage.getItem('token-user');

      await fetch(`https://flubbackend.onrender.com/message/${selectedChat._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
        }
      })
        .then((res) => res.json())
        .then(async (responseData) => {
          setMessage(responseData);
          socket.emit('join chat', selectedChat._id);
        })
        .catch((error) => {
          // console.error('Error Posting data:', error);
        });
     }catch(err){

     }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // If Enter key is pressed (keyCode 13)
      sendMessage(); // Call the sendMessage function to send the message
    }
  };

  return (
    <div className='chatboxmessages'>
     <div className="chatheader">
      <div className="header-1">
        <img className='chatProfileimage' src={senderProfile} alt="this is a image" />
        <div className="chatname199">{sender || chatName}</div>
        {isTyping ? <div className='typingindicator'>Typing...</div>: (<></>)}
      </div>
      <div className="header-2">
        <button className='chatonback' onClick={backbutton}><i class="fa-solid fa-xmark fa-xl" style={{color: '#ffffff'}}></i></button>
        {selectedChat.isGroupChat && ( // Render the info button only if the chat is a group chat
          <button className="chatonback" onClick={toggleChatInfo}>
            <i class="fa-solid fa-circle-info fa-xl" style={{color: '#ffffff'}}></i>
          </button>
        )}
      </div>
     </div>
      {showChatInfo && selectedChat.isGroupChat && ( // Render ChatInfo component only if showChatInfo is true and the chat is a group chat
        <div className="chatinfo-overlay">
          <div className="chatinfo-content">
            <ChatInfo selectedChat={selectedChat} toggle={toggleChatInfo} />
          </div>
        </div>
      )}
      <div className="chatcontainerchatwillhappenhere">
      {loading ?  <Loading/> : <div>
         <div className="messagesinmessageboxsendandrecieve">
          <ScrolableChat Message={Message}/>
         </div>
        </div>}
      </div>
      <div className="chatbottomofchat">
         <input className='chatinputbottom' type="text" onChange={typeHandelling} onKeyDown={handleKeyDown} placeholder='Message'  value={newMessage} />
         <button className='sendMessagebutton99' onClick={sendMessage}><i class="fa-solid fa-paper-plane fa-lg" style={{color: "#ffffff"}}></i></button>
         </div>
    </div>
  );
}

export default ChatBox;