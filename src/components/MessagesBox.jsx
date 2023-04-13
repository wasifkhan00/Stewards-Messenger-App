import React, { useContext } from "react";
import { themeContext } from "../App";
import { messageBox_Container_Style } from "./Styles";

const MessagesBox = (props) => {
  let { dark } = useContext(themeContext);

  const fontColor = dark ? "#ffff" : "#000000";

  const fontsColors = {
    color: fontColor,
  };

  const date_Style = {
    fontSize: ".7rem",
    color: fontColor,
  };

  return (
    <>
      <div className="messages_Container">
        <span style={{ color: fontColor }}>{props.Name}</span>

        <div className="receive_message_box" style={messageBox_Container_Style}>
          <p id="receiveMessage" style={fontsColors}>
            {props.messages}
          </p>
          <br />
          <span></span>
          {
            <small className="time" style={fontsColors}>
              {props.messageTime}
            </small>
          }
          <small className="date" style={date_Style}>
            {props.date}
          </small>
        </div>
      </div>
    </>
  );
};

export default MessagesBox;
