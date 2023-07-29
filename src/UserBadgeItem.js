import React from 'react'

function UserBadgeItem({user, handleFunction}) {
  return (
    <div style={{width: "auto", paddingLeft: "15px", paddingRight:"15px", backgroundColor:"#8f08ea", color: "white", paddingTop: "10px", paddingBottom: "10px", borderRadius: "10px"}} onClick={handleFunction}>
    <span>{user.Name}  </span>
     <i class="fa-solid fa-xmark fa-lg" style={{color: "#ffffff"}}></i>
    </div>
  )
}

export default UserBadgeItem