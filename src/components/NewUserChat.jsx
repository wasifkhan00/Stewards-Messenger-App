import React from "react";

const NewUserChat = () => {
  const new_User_Joined_Message_Style = {
    display: "flex",
    justifyContent: "center",
    margin: "1rem 0",
  };

  return (
    <div style={new_User_Joined_Message_Style}>
      <div className="user_Joined NewUser" style={{ color: "#ba8229" }}>
        If you add someone in the group they will be able to see your previous
        messages. Messages are End to End-Ecncrypted
      </div>
    </div>
  );
};

export default NewUserChat;
