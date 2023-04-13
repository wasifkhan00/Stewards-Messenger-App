import React from "react";

const UserJoined = (props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
      <div className="user_Joined" style={{ color: "#5d9281" }}>
        {`${props.joinedBy} Joined the chat`}
      </div>
    </div>
  );
};

export default UserJoined;
