import React from 'react'
import ScrollableFeed  from 'react-scrollable-feed';
import { ChatState } from './Context/ChatProvider';

const isSameSender = (message, m, i, userId)=>{
    return (
        i < message.length -1 && 
        (message[i+1].sender._id !== m.sender._id || 
            message[i+1].sender._id === undefined 
        ) && message[i].sender._id !== userId
    );
}

const isLastMessage = (message, i, userId) => {
    return (
        i === message.length -1 &&
        message[message.length - 1].sender._id !== userId &&
        message[message.length - 1].sender._id
    );
}

const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

function ScrolableChat({Message}) {
  const {user} = ChatState();
  console.log(Message);
  return (
    <ScrollableFeed>
        { Message &&
          Message && Message.map((m, i)=> (
            <div style={{ display: "flex", paddingLeft: "10px" , paddingRight: "10px" }} key={m._id}>
            {(isSameSender(Message, m, i, user._id) ||
              isLastMessage(Message, i, user._id)) && (
                <div className="tooltip-container">
                <img
                  className="avatar"
                  src={m.sender.pic}
                  alt={m.sender.name}
                  title={m.sender.name}
                />
                <span className="tooltip-text">{m.sender.Name}</span>
              </div>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#ff00b3" : "#000000"
                }`,
                marginLeft: isSameSenderMargin(Message, m, i, user._id),
                marginTop: isSameUser(Message, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "7px 15px",
                maxWidth: "75%",
                fontFamily: "ITCAvantGardeStd-Bk,Arial,sans-serif",
                color: "white",
                border: "1px solid white",
              }}
            >
              {m.content}
            </span>
          </div>
        ))
        }  
    </ScrollableFeed>
  )
}

export default ScrolableChat
