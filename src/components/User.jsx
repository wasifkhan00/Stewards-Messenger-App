import React, { useContext } from "react";
import "../styles/chat.css";
import profilePicture from "../images/profile.png";
import { themeContext } from "../App";

const User = (props) => {
  let { dark, unreadMessages } = useContext(themeContext);
  const fontColor = dark ? "#ffff" : "#000000";

  const user_Container_Style = {
    borderRight: unreadMessages ? "7px solid rgb(132 131 128)" : null,
    backgroundColor: "transparent",
    boxShadow: "0 0px 0px 1px rgb(71 147 222)",
    marginTop: props.marginTop,
    cursor: props.showWholeElementCursor ? "pointer" : "auto",
  };

  const user_Group_Name_Style = {
    color: fontColor,
    cursor: props.showCursor ? "pointer" : "auto",
  };

  return (
    <>
      <section
        onClick={props.wholeElementClicked}
        style={user_Container_Style}
        className={
          props.topChatContainer === true
            ? " chat_Details topChatContainer"
            : "chat_Details"
        }>
        <div className="imgContainers">
          <div className="imageContainerUser">
            <img
              src={profilePicture}
              alt="profile"
              style={{ pointerEvents: "none" }}
            />
          </div>

          <div className="nameC">
            <h5 style={user_Group_Name_Style} onClick={props.onClick}>
              {props.groupName}
            </h5>
            <h6
              style={{
                color: fontColor,
              }}>
              {props.lastMessage}
            </h6>
          </div>
        </div>

        <h6 style={{ color: fontColor }} className="time">
          {props.time}
        </h6>
      </section>
    </>
  );
};

export default User;
