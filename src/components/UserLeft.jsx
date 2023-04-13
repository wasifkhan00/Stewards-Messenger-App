import React from "react";
import { user_Left_Container } from "./Styles";

const UserLeft = (props) => {
  return (
    <div style={user_Left_Container}>
      <div className="user_Joined" style={{ color: "#bf7a83" }}>
        {`${props.leftTheGroup} left the chat`}
      </div>
    </div>
  );
};

export default UserLeft;
