import React, { useState, useEffect } from 'react';
import './css/Commnet.css';  
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function Comment({ postId }) {
  const [loder, setloder] = useState(false)
  const [data, setData] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    let token = localStorage.getItem('token-user');

    fetch(`https://flubbackend.onrender.com/posts/post/${postId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData);


        // Rest of your code...
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
      });
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setloder(true);
    const newComment = {
      userId: localStorage.getItem('user-id'),
      text: commentText,
    };
  
    fetch(`https://flubbackend.onrender.com/posts/post/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token-user')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    })
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData) {
          // Assuming the server responds with the updated post object
          setData(responseData.comment);
          setCommentText('');
        } else {
          // console.error('Error submitting comment:', responseData.message);
        }
      })
      .catch((error) => {
        // console.error('Error submitting comment:', error);
      });

      setloder(false);
  };

  const navigate = useNavigate();
  const handleProfileClick = (Poster) => {

    navigate( '/OthersProfilePage', { state: { Poster } } );
  };
  
  return (
    <div className="commentBox">
      <label htmlFor="comment" className='comment'>Comment:</label>
      <textarea
        name="comment"
        id="write-your-comment"
        rows="3"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      ></textarea>
      <button className='btn-comment button-50' onClick={handleCommentSubmit}>{loder?<div id="loder-of-the-button-of-the-login-submit"><ClipLoader size={16} color="#ffff" loading={true} /></div>:"Comment"}</button>
      <div className="commentContainer">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="commentItem">
              <div ><img className='commentor-Profilepick' onClick={() => handleProfileClick(item.userId)} src={item.profile} alt="" /></div>
              <div className="Nameandcommentsec">
              <div className='commentor-actual'><p>{item.name}:</p></div>
              <div className='comment-actual' ><p>{item.comment}</p></div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}  

export default Comment;
